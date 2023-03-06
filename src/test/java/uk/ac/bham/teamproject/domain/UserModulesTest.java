package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class UserModulesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UserModules.class);
        UserModules userModules1 = new UserModules();
        userModules1.setId(1L);
        UserModules userModules2 = new UserModules();
        userModules2.setId(userModules1.getId());
        assertThat(userModules1).isEqualTo(userModules2);
        userModules2.setId(2L);
        assertThat(userModules1).isNotEqualTo(userModules2);
        userModules1.setId(null);
        assertThat(userModules1).isNotEqualTo(userModules2);
    }
}
