import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.*;

public class Main {
    /**
     * A component that provides tuples for base tables.
     */
    static abstract class TableStorage {
        abstract List<Tuple> getTuples(String tableName);
    }

    record Tuple(Map<String, Value> fields) {
        Value getValue(String fieldName) {
            return Objects.requireNonNull(fields.get(fieldName));
        }

        public Tuple plus(Tuple that) {
            Map<String, Value> newFields = new HashMap<>(fields);
            for (Map.Entry<String, Value> entry : that.fields.entrySet()) {
                if (!newFields.containsKey(entry.getKey())) {
                    newFields.put(entry.getKey(), entry.getValue());
                }
            }
            return new Tuple(Map.copyOf(newFields));
        }
    }

    record Value(String value) {
    }

    /**
     * Query type with a getTuples method.
     */
    abstract static class Query {

        /**
         * Implement this method for each type of query.
         */
        abstract List<Tuple> getTuples(TableStorage tableStorage);

        abstract String format();

        static class Table extends Query {
            private final String tableName;

            Table(String tableName) {
                this.tableName = tableName;
            }

            @Override
            List<Tuple> getTuples(TableStorage tableStorage) {
                return tableStorage.getTuples(tableName);
            }

            @Override
            public String format() {
                return tableName;
            }
        }

        static class Filter extends Query {
            private final Query query;
            private final String columnName;
            private final Value value;

            Filter(Query query, String columnName, Value value) {
                this.query = query;
                this.columnName = columnName;
                this.value = value;
            }

            @Override
            List<Tuple> getTuples(TableStorage tableStorage) {
                List<Tuple> res = new ArrayList<>();
                for (Tuple t : query.getTuples(tableStorage)) {
                    if (t.getValue(columnName).equals(value)) {
                        res.add(t);
                    }
                }
                return res;
            }


            @Override
            public String format() {
                return "F<%s == '%s'> . %s".formatted(columnName, value.value, query.format());
            }
        }

        static class Project extends Query {
            private final Query query;
            private final List<String> columnNames;

            Project(Query query, List<String> columnNames) {
                this.query = query;
                this.columnNames = columnNames;
            }

            @Override
            List<Tuple> getTuples(TableStorage tableStorage) {
                List<Tuple> result = new ArrayList<>();
                for (Tuple tuple : query.getTuples(tableStorage)) {
                    Map<String, Value> projectedFields = new HashMap<>();

                    for (String columnName : columnNames) {
                        projectedFields.put(columnName, tuple.getValue(columnName));
                    }
                    result.add(new Tuple(projectedFields));
                }
                return result;
            }

            @Override
            public String format() {
                return "P<%s> . %s".formatted(String.join(", ", columnNames), query.format());
            }
        }

        static class Join extends Query {
            Query leftQuery;
            String leftColName;
            Query rightQuery;
            String rightColName;

            Join(Query leftQuery, String leftColName, Query rightQuery, String rightColName) {
                this.leftQuery = leftQuery;
                this.leftColName = leftColName;
                this.rightQuery = rightQuery;
                this.rightColName = rightColName;
            }

            @Override
            List<Tuple> getTuples(TableStorage tableStorage) {
                List<Tuple> leftTuples = leftQuery.getTuples(tableStorage);
                List<Tuple> rightTuples = rightQuery.getTuples(tableStorage);

                List<Tuple> result = new ArrayList<>();

                for (Tuple leftTuple : leftTuples) {
                    for (Tuple rightTuple : rightTuples) {
                        if (leftTuple.getValue(leftColName).equals(rightTuple.getValue(rightColName))) {
                            result.add(leftTuple.plus(rightTuple));
                        }
                    }
                }

                return result;
            }

            @Override
            public String format() {
                return "J<%s, %s>(%s * %s)".formatted(leftColName, rightColName, leftQuery.format(),
                        rightQuery.format());
            }
        }
    }

    /* Helper methods to construct test queries and test data */
    private static Query table(String tableName) {
        return new Query.Table(tableName);
    }

    private static Query filter(Query query, String columnName, String value) {
        return new Query.Filter(query, columnName, new Value(value));
    }

    private static Query join(Query leftQuery, String leftColName, Query rightQuery, String rightColName) {
        return new Query.Join(leftQuery, leftColName, rightQuery, rightColName);
    }

    private static Query project(Query query, String... columnNames) {
        return new Query.Project(query, List.of(columnNames));
    }

    private static Value v(String s) {
        return new Value(s);
    }

    /* Test data */
    private static final Tuple tuple1 = new Tuple(
            Map.of("first_name", v("Bob"), "last_name", v("Jones"), "company", v("1")));
    private static final Tuple tuple2 = new Tuple(
            Map.of("first_name", v("Bob"), "last_name", v("Smith"), "company", v("1")));
    private static final Tuple tuple3 = new Tuple(
            Map.of("first_name", v("Alice"), "last_name", v("Jones"), "company", v("2")));
    private static final Tuple tuple4 = new Tuple(
            Map.of("first_name", v("Alice"), "last_name", v("Williams"), "company", v("1")));

    private static final List<Tuple> personTable = List.of(tuple1, tuple2, tuple3, tuple4);

    private static final Tuple tuple5 = new Tuple(
            Map.of("id", v("1"), "name", v("A+ Tacos"), "city", v("San Jose")));
    private static final Tuple tuple6 = new Tuple(
            Map.of("id", v("2"), "name", v("A+ Burgers"), "city", v("San Diego")));
    private static final Tuple tuple7 = new Tuple(
            Map.of("id", v("3"), "name", v("A+ Pizza"), "city", v("San Jose")));

    private static final List<Tuple> companyTable = List.of(tuple5, tuple6, tuple7);


    /* Sample table storage */
    private static final TableStorage tableStorage = new TableStorage() {
        private final Map<String, List<Tuple>> nameToTuples = Map.of("person", personTable, "company", companyTable);

        @Override
        List<Tuple> getTuples(String tableName) {
            return Objects.requireNonNull(nameToTuples.get(tableName));
        }
    };

    private static void printTuples(List<Tuple> tuples) {
        if (tuples.isEmpty()) {
            System.out.println("[no rows]");
            return;
        }
        // Print header
        List<String> columnNames = tuples.get(0).fields.keySet().stream().sorted().toList();
        for (String columnName : columnNames) {
            System.out.printf("%30s ", columnName);
        }
        System.out.println();
        // Print header-body separator
        for (String ignored : columnNames) {
            System.out.print("-".repeat(30) + " ");
        }
        System.out.println();
        // Print body
        for (Tuple tuple : tuples) {
            for (String columnName : columnNames) {
                System.out.printf("%30s ", tuple.getValue(columnName).value);
            }
            System.out.println();
        }
    }

    private static void print(TableStorage tableStorage, Query query) {
        System.out.printf("\n %s n", query.format());
        printTuples(query.getTuples(tableStorage));
    }

    public static void main(String[] args) {
        print(tableStorage, table("person"));
        print(tableStorage, table("company"));
        print(tableStorage, filter(table("person"), "first_name", "Bob"));
        print(tableStorage, join(table("person"), "company", table("company"), "id"));
        print(tableStorage, filter(join(table("person"), "company", table("company"), "id"), "city", "San Diego"));
        print(tableStorage,
                project(filter(join(table("person"), "company", table("company"), "id"), "city", "San Diego"),
                        "last_name", "first_name"));
    }
}
