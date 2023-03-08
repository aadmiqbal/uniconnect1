import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

//Uniconnect create profile fucntion

//Creating the profile class
public class Profile {

    private String name;
    private String email;
    private String yearofstudy;
    private String course;

    public Profile(String name, String email, String yearofstudy, String course) {
        this.name = name;
        this.email = email;
        this.yearofstudy = yearofstudy;
        this.course = course;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getYearofstudy() {
        return yearofstudy;
    }

    public String getCourse() {
        return course;
    }
}

//Establisihng connection to the database with path
public class ConnectionManager {

    public static Connection getConnection() throws SQLException {
        String url =
            "jdbc:sqlite:C:\\Users\\User\\Desktop\\UniConnect\\UniConnect\\src\\main\\java\\com\\example\\uniconnect\\uniconnect.db";
        return DriverManager.getConnection(url);
    }
}

//insterting the data to the database
public class CreateProfile {

    public static void createProfile(String name, String email, String yearofstudy, String course) throws SQLException {
        String sql = "INSERT INTO profile(name, email, yearofstudy, course) VALUES(?, ?, ?, ?)";
        try (Connection conn = ConnectionManager.getConnection(); PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, name);
            pstmt.setString(2, email);
            pstmt.setString(3, yearofstudy);
            pstmt.setString(4, course);
            pstmt.executeUpdate();
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
    }
}

//Tell frontend to display profile
public class ProfileController {

    @GetMapping("/profile")
    public String profile(Model model) {
        model.addAttribute("profile", new Profile());
        return "profile";
    }
}
