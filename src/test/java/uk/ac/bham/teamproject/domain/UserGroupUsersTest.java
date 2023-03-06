package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class UserGroupUsersTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UserGroupUsers.class);
        UserGroupUsers userGroupUsers1 = new UserGroupUsers();
        userGroupUsers1.setId(1L);
        UserGroupUsers userGroupUsers2 = new UserGroupUsers();
        userGroupUsers2.setId(userGroupUsers1.getId());
        assertThat(userGroupUsers1).isEqualTo(userGroupUsers2);
        userGroupUsers2.setId(2L);
        assertThat(userGroupUsers1).isNotEqualTo(userGroupUsers2);
        userGroupUsers1.setId(null);
        assertThat(userGroupUsers1).isNotEqualTo(userGroupUsers2);
    }
}
