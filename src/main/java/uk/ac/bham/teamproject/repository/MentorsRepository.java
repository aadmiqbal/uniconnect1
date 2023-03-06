package uk.ac.bham.teamproject.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.Mentors;

/**
 * Spring Data JPA repository for the Mentors entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MentorsRepository extends JpaRepository<Mentors, Long> {}
