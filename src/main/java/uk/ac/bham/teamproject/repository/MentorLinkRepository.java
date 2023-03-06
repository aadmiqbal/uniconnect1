package uk.ac.bham.teamproject.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.MentorLink;

/**
 * Spring Data JPA repository for the MentorLink entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MentorLinkRepository extends JpaRepository<MentorLink, Long> {}
