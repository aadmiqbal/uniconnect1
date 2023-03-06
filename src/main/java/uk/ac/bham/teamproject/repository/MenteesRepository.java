package uk.ac.bham.teamproject.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.Mentees;

/**
 * Spring Data JPA repository for the Mentees entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MenteesRepository extends JpaRepository<Mentees, Long> {}
