package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class MenteesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Mentees.class);
        Mentees mentees1 = new Mentees();
        mentees1.setId(1L);
        Mentees mentees2 = new Mentees();
        mentees2.setId(mentees1.getId());
        assertThat(mentees1).isEqualTo(mentees2);
        mentees2.setId(2L);
        assertThat(mentees1).isNotEqualTo(mentees2);
        mentees1.setId(null);
        assertThat(mentees1).isNotEqualTo(mentees2);
    }
}
