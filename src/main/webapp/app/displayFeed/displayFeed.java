import java.sql.*;
public class displayFeed {
    private static ArrayList<String[]> compileResults(ResultSet rs){ //TODO: to be finished
        ArrayList<String[]> result = null;
        try{
            int size = rs.getMetaData().getColumnCount();
            result = new ArrayList<String[]>();
            while(rs.next()){
                String[] l = new String[size];
                for(int i = 0; i < size; i++) l[i] = rs.getString(i);
                result.add(l);
            }
        } catch (Exception e){
            System.out.println(e);
        }
        return result;
    }

    private static ArrayList<String> getUserModules(int UserId, Connection con){
        ArrayList modules = null;
        try {
            PreparedStatement st = con.prepareStatement("SELECT studyYear, subjectId FROM AppUsers WHERE id = ?");
            st.setInt(1, UserId);
            ResultSet rs = st.executeQuery();
            int studyYear = rs.getInt("studyYear");
            int subjectId = rs.getInt("subjectId");

            st = con.prepareStatement("SELECT id, moduleName FROM Modules WHERE studyYear = ? AND subject = ? AND optional = False");
            st.setInt(1, studyYear);
            st.setInt(2, subjectId);
            modules = compileResults(st.executeQuery());

            st = con.prepareStatement("SELECT Modules.id, Modules.moduleName FROM Modules INNER JOIN OptionalModuleLink ON Modules.id = OptionalModuleLink.moduleId WHERE OptionalModuleLink.userId = ? AND Modules.studyYear = ?");
            st.setInt(1, UserId);
            st.setInt(2, studyYear);
            modules.addAll(compileResults(st.executeQuery()));
        } catch (Exception e){
            System.out.println(e);
        }

        return modules;
    }

    private static void displayFeedBackend(int n, String[] filters, int UserId) {
        try (Connection con = getCon()) {
            ArrayList userModules = getUserModules(UserId, con);
            if (!Arrays.asList(filters).contains("All modules")) {

            }

            //ResultSet rs = st.executeQuery("SELECT TOP " + n + " * FROM Users WHERE ");

        } catch (SQLException sq) {
            System.out.println(sq);
        }
    }
}
