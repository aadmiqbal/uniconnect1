package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class MentorLinkTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MentorLink.class);
        MentorLink mentorLink1 = new MentorLink();
        mentorLink1.setId(1L);
        MentorLink mentorLink2 = new MentorLink();
        mentorLink2.setId(mentorLink1.getId());
        assertThat(mentorLink1).isEqualTo(mentorLink2);
        mentorLink2.setId(2L);
        assertThat(mentorLink1).isNotEqualTo(mentorLink2);
        mentorLink1.setId(null);
        assertThat(mentorLink1).isNotEqualTo(mentorLink2);
    }
}
