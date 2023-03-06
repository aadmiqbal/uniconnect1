package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class UserGroupAdTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UserGroupAd.class);
        UserGroupAd userGroupAd1 = new UserGroupAd();
        userGroupAd1.setId(1L);
        UserGroupAd userGroupAd2 = new UserGroupAd();
        userGroupAd2.setId(userGroupAd1.getId());
        assertThat(userGroupAd1).isEqualTo(userGroupAd2);
        userGroupAd2.setId(2L);
        assertThat(userGroupAd1).isNotEqualTo(userGroupAd2);
        userGroupAd1.setId(null);
        assertThat(userGroupAd1).isNotEqualTo(userGroupAd2);
    }
}
