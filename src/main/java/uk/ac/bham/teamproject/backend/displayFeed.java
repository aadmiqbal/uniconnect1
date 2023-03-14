package uk.ac.bham.teamproject.backend;

import java.sql.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;

class ConnectionManager {

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
            PreparedStatement st = con.prepareStatement("SELECT id, moduleName FROM UserModules WHERE studyYear = ? AND optional = False"); //AND subject = ?
            st.setInt(1, studyYear);
            modules = compileResults(st.executeQuery());

            st =
                con.prepareStatement(
                    "SELECT UserModules.id, UserModules.moduleName FROM UserModules INNER JOIN ModuleLink ON UserModules.id = ModuleLink.moduleId WHERE ModuleLink.userId = ? AND UserModules.studyYear = ?"
                ); //TODO: check links
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

    private static String[] getPotentialConnections(ArrayList<String[]> modules, int userId, int studyYear, Connection con) {
        String[] connections = null;
        try {
            String modulesString = null;
            for (String[] module : modules) modulesString = modulesString + ", " + module[0];
            PreparedStatement st = con.prepareStatement(
                "SELECT AppUsers.id FROM AppUsers INNER JOIN ModuleLink ON AppUsers.id = ModuleLink.userId WHERE ModuleLink.moduleId IN (?);"
            );
            st.setString(1, modulesString);
            connections = (String[]) st.executeQuery().getArray("is_nullable").getArray();
        } catch (SQLException e) {
            System.out.println(e);
        }
        return connections;
    }

    static String[] shuffleArray(String[] ar) {
        Random rnd = ThreadLocalRandom.current();
        for (int i = ar.length - 1; i > 0; i--) {
            int index = rnd.nextInt(i + 1);
            String a = ar[index];
            ar[index] = ar[i];
            ar[i] = a;
        }
        return ar;
    }

    private static String[][] getConnectionsDetails(String[] connections, Connection con) {
        String[][] connectionDetails = new String[connections.length][5];
        PreparedStatement ps = null;
        try {
            for (int i = 0; i < connections.length; i++) {
                ps = con.prepareStatement("SELECT name, studyYear, pfp FROM AppUsers WHERE id = ?;");
                ps.setInt(1, Integer.parseInt(connections[i]));
                ResultSet rs = ps.executeQuery();
                connectionDetails[i][0] = connections[i];
                connectionDetails[i][1] = rs.getString("name");
                connectionDetails[i][2] = String.valueOf(rs.getInt("studyYear"));
                connectionDetails[i][3] = rs.getString("pfp");
            }
        } catch (SQLException e) {
            System.out.println(e);
        }
        return connectionDetails;
    }

    private static String displayFeedBackend(int n, String[] filters, int UserId) { //private static String[][] displayFeedBackend(int n, String[] filters, int UserId) {
        String[][] connectionsDetails = null;
        try (Connection con = ConnectionManager.getConnection()) {
            PreparedStatement st = con.prepareStatement("SELECT studyYear, subject FROM AppUsers WHERE id = ?"); //subject link doesn't exist?
            st.setInt(1, UserId);
            ResultSet rs = st.executeQuery();
            int studyYear = rs.getInt("studyYear");
            int subjectId = rs.getInt("subjectId");

            ArrayList userModules = getUserModules(UserId, studyYear, subjectId, con);
            userModules = filterModules(userModules, filters);

            String[] potentialConnections = shuffleArray(getPotentialConnections(userModules, UserId, studyYear, con));
            potentialConnections = Arrays.copyOf(potentialConnections, n);

            connectionsDetails = getConnectionsDetails(potentialConnections, con);

            con.close();
        } catch (SQLException sq) {
            System.out.println(sq);
        }
        return "Hello world"; //return connectionsDetails;
    }
}
