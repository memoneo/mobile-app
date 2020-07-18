import { Goal } from "memoneo-common/lib/types"

interface HasName {
  name: string
}

interface HasSurname {
  surname: string
}

interface HasDisplayName {
  displayName: string
}

export function sortByName(hasName1: HasName, hasName2: HasName) {
  if (hasName1.name > hasName2.name) {
    return 1
  }

  if (hasName1.name < hasName2.name) {
    return -1
  }

  return 0
}

export function sortBySurname(
  hasSurname1: HasSurname,
  hasSurname2: HasSurname
) {
  if (hasSurname1.surname > hasSurname2.surname) {
    return 1
  }

  if (hasSurname1.surname < hasSurname2.surname) {
    return -1
  }

  return 0
}

export function sortByDisplayName(
  hasDisplayName1: HasDisplayName,
  hasDisplayName2: HasDisplayName
) {
  if (hasDisplayName1.displayName > hasDisplayName2.displayName) {
    return 1
  }

  if (hasDisplayName1.displayName < hasDisplayName2.displayName) {
    return -1
  }

  return 0
}

export function sortGoals(goal1: Goal, goal2: Goal) {
  if (
    (!goal1.parent || (<Goal>goal1.parent).id) &&
    (!goal2.parent || (<Goal>goal2.parent).id)
  ) {
    const parent1 = <Goal>goal1.parent
    const parent2 = <Goal>goal2.parent

    if (goal1.rank > goal2.rank) {
      return 1
    }

    if (goal1.rank < goal2.rank) {
      return -1
    }

    if (goal1.parent && !goal2.parent) return 1
    if (!goal1.parent && goal2.parent) return -1

    if (goal1.name > goal2.name) return 1
    if (goal1.name < goal2.name) return -1

    return 0
  } else {
    throw new Error(
      `Goal parents in list must be of the same type for sort, not of ${typeof goal1.parent} and ${typeof goal2.parent}`
    )
  }
}
