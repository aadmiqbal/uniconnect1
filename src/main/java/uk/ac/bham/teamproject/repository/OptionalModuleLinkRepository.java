package uk.ac.bham.teamproject.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.OptionalModuleLink;

/**
 * Spring Data JPA repository for the OptionalModuleLink entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OptionalModuleLinkRepository extends JpaRepository<OptionalModuleLink, Long> {}
