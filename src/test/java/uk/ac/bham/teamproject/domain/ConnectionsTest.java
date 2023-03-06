package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class ConnectionsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Connections.class);
        Connections connections1 = new Connections();
        connections1.setId(1L);
        Connections connections2 = new Connections();
        connections2.setId(connections1.getId());
        assertThat(connections1).isEqualTo(connections2);
        connections2.setId(2L);
        assertThat(connections1).isNotEqualTo(connections2);
        connections1.setId(null);
        assertThat(connections1).isNotEqualTo(connections2);
    }
}
