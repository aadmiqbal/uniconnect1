package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class AppUsersTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AppUsers.class);
        AppUsers appUsers1 = new AppUsers();
        appUsers1.setId(1L);
        AppUsers appUsers2 = new AppUsers();
        appUsers2.setId(appUsers1.getId());
        assertThat(appUsers1).isEqualTo(appUsers2);
        appUsers2.setId(2L);
        assertThat(appUsers1).isNotEqualTo(appUsers2);
        appUsers1.setId(null);
        assertThat(appUsers1).isNotEqualTo(appUsers2);
    }
}
