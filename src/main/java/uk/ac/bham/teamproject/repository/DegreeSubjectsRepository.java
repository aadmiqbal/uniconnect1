package uk.ac.bham.teamproject.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.DegreeSubjects;

/**
 * Spring Data JPA repository for the DegreeSubjects entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DegreeSubjectsRepository extends JpaRepository<DegreeSubjects, Long> {}
