
A line is given by two points
a point is a object like this  {'x': 15, 'y': 47}

```python
def ABOVELINE(line, point):
  # Returns true when point is above the line false otherwise
  return True or False
```

```python
def CREATE POINTS(n)
  # Returns a distribution of n swordsmen,archers and mages such that a cut line for all three groups can be found
  #1. Choose a random cut line l by
    # 1a. Choosing a point the line goes trough in the center part of the canavas
        # (e.g. betweeen 1/4 and 3/4 canvas width and heigt)
    # 1b. Choosing a arbitrary angle  (travel a bit along this angle to select a second point.)

  # 2. find points above and below the line (soldiers)
  points_above = []
  points_below = []
  While (len(points_below) < n/2 or len(points_above) < n/2 )
    p = random_point()
    if aboveline(l, p):
      points_above.append(p)
    else:
      points_below.append(p)
    soldiers is points_below[:n/2] + points_above[:n/2]

  #3. Do the same for mages and archers

  #  4.
  return {"mages":mages, "archers":archers, "swordsmen":swordsmen}
```

```python
def OBSFUCATEPOINTS(n):
  # Swaps n points
  Repeat the following n times
  1. Randomly select a category mages,archers, swordsmen.
  2.randomly slect a point in this category
  3. Randomly select a disjoint category (ie mages or swordsmen when archers was selected by 1) 
      #NB this can be done by adding 1 or 2 to the category number of the first selected category
  4. randomly select a point from this category
  5. swap these points
```

```python
def FINDCUT(soldierlocations):
  # Finds wheter there is is an cut divding mages archers and swordsmen in two
  # equal parts. If there is such a cut we return the line giving such a cut otherwise
  # we return null
  1. Dualize the problem
  2. ???
  3. Profit
```
