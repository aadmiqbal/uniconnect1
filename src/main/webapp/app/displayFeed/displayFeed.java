import java.sql.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;

public class ConnectionManager {

    public static Connection getConnection() throws SQLException { //TODO: fix url
        String url =
            "jdbc:postgresql:C:\\Users\\User\\Desktop\\UniConnect\\UniConnect\\src\\main\\java\\com\\example\\uniconnect\\uniconnect.db";
        return DriverManager.getConnection(url);
    }
}

public class displayFeed {

    private static ArrayList<String[]> compileResults(ResultSet rs) {
        ArrayList<String[]> result = null;
        try {
            int size = rs.getMetaData().getColumnCount();
            result = new ArrayList<String[]>();
            while (rs.next()) {
                String[] l = new String[size];
                for (int i = 0; i < size; i++) l[i] = rs.getString(i);
                result.add(l);
            }
        } catch (Exception e) {
            System.out.println(e);
        }
        return result;
    }

    private static ArrayList<String[]> getUserModules(int UserId, int studyYear, int subjectId, Connection con) {
        ArrayList modules = null;
        try {
            PreparedStatement st = con.prepareStatement(
                "SELECT id, moduleName FROM Modules WHERE studyYear = ? AND subject = ? AND optional = False"
            );
            st.setInt(1, studyYear);
            st.setInt(2, subjectId);
            modules = compileResults(st.executeQuery());

            st =
                con.prepareStatement(
                    "SELECT Modules.id, Modules.moduleName FROM Modules INNER JOIN OptionalModuleLink ON Modules.id = OptionalModuleLink.moduleId WHERE OptionalModuleLink.userId = ? AND Modules.studyYear = ?"
                );
            st.setInt(1, UserId);
            st.setInt(2, studyYear);
            modules.addAll(compileResults(st.executeQuery()));
        } catch (Exception e) {
            System.out.println(e);
        }

        return modules;
    }

    private static ArrayList<String[]> filterModules(ArrayList<String[]> userModules, String[] filters) {
        if (!Arrays.asList(filters).contains("All modules")) {
            Iterator itr = userModules.iterator();
            while (itr.hasNext()) {
                String[] module = (String[]) itr.next();
                if (!Arrays.asList(filters).contains(module[1])) itr.remove();
            }
        }
        return userModules;
    }

    private static ArrayList<String[]> getPotentialConnections(ArrayList<String[]> modules, int userId, int studyYear, Connection con) {
        ArrayList<String[]> connections = null;
        try {
            String modulesString = null;
            for (String[] module : modules) modulesString = modulesString + ", " + module[0];
            PreparedStatement st = con.prepareStatement(
                "SELECT AppUsers.id FROM AppUsers INNER JOIN OptionalModuleLink ON AppUsers.id = OptionalModuleLink.userId WHERE OptionalModuleLink.moduleId IN (?);"
            );
            st.setString(1, modulesString);
            connections.addAll(compileResults(st.executeQuery()));
        } catch (SQLException e) {
            System.out.println(e);
        }
        return connections;
    }

    private static void displayFeedBackend(int n, String[] filters, int UserId) {
        try (Connection con = ConnectionManager.getConnection();) {
            PreparedStatement st = con.prepareStatement("SELECT studyYear, subjectId FROM AppUsers WHERE id = ?");
            st.setInt(1, UserId);
            ResultSet rs = st.executeQuery();
            int studyYear = rs.getInt("studyYear");
            int subjectId = rs.getInt("subjectId");

            ArrayList userModules = getUserModules(UserId, studyYear, subjectId, con);
            userModules = filterModules(userModules, filters);

            ArrayList<String[]> potentialConnections = getPotentialConnections(userModules, UserId, studyYear, con);
        } catch (SQLException | ClassNotFoundException sq) {
            System.out.println(sq);
        }
    }
}
