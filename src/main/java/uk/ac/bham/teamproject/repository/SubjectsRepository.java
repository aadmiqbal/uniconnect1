package uk.ac.bham.teamproject.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.Subjects;

/**
 * Spring Data JPA repository for the Subjects entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SubjectsRepository extends JpaRepository<Subjects, Long> {}
