package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class MentorsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Mentors.class);
        Mentors mentors1 = new Mentors();
        mentors1.setId(1L);
        Mentors mentors2 = new Mentors();
        mentors2.setId(mentors1.getId());
        assertThat(mentors1).isEqualTo(mentors2);
        mentors2.setId(2L);
        assertThat(mentors1).isNotEqualTo(mentors2);
        mentors1.setId(null);
        assertThat(mentors1).isNotEqualTo(mentors2);
    }
}
