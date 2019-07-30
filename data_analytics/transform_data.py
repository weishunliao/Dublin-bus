import pandas as pd
import numpy as np

def transform_data(df):
    """Function that takes a dataframe as input and returns a new dataframe with the required format."""

    # the input dataframe is sorted
    df = df.sort_values(by=['dayofservice', 'tripid', 'progrnumber'])

    # a dict is created to store data for the new dataframe
    transformed = dict()

    # a count of row number is tracked, and is used as the key when inserting data into the dict
    count = 0

    # iterate through each row in the dataframe
    for index, row in df.iterrows():

        # the first row in the dataframe is a special case
        if index == 0:
            current_trip, current_prog = row["tripid"], row["progrnumber"]
            # check if we are missing any data
            if current_prog > 1:
                count, transformed = add_missing_rows_start(count, current_prog, row, transformed)
            # save the relevant data from this row
            last_row = save_row(row, current_prog)
                
        # if it's not the first row...
        else:
            last_trip, last_prog = current_trip, current_prog
            current_trip, current_prog = row["tripid"], row["progrnumber"]

            # first check that we're still on the same trip
            if last_trip != current_trip:
                # if not, then check if we are missing some data
                if current_prog > 1:
                    # add missing rows
                    count, transformed = add_missing_rows_start(count, current_prog, row, transformed)
                # save the relevant data from this row
                last_row = save_row(row, current_prog)

            # if it is the same trip as the last row...
            else:
                # check if prog has incremented by 1, if not we're missing data
                if current_prog - last_prog > 1:
                    # first complete the last row with missing vals
                    count, transformed = complete_missing(count, last_prog, last_row, transformed)
                    # then add missing rows
                    count, transformed = add_missing_rows_mid(count, current_prog, last_prog, row, transformed)
                else:
                    # if we're not missing data, complete the last row with data from this row
                    count, transformed = complete_row(count, current_prog, row, last_row, transformed)
                # save the relevant data from this row
                last_row = save_row(row, current_prog)

    # build a new dataframe and return it
    return build_dataframe(transformed)

def add_missing_rows_start(count, prog, row, transformed):
    """Function that adds the relevant number of missing rows."""
    for i in range(prog-2):
        transformed[count] = missing_row(row, i)
        count += 1
    transformed[count] = [row['dayofservice'], row['tripid'], row['lineid'], row['routeid'], row['direction'], \
                                    prog-1, np.nan, np.nan, prog, row['stoppointid'], row['actualtime_arr_stop']]
    count += 1
    return count, transformed

def add_missing_rows_mid(count, current_prog, last_prog, row, transformed):
    """Function that adds the relevant number of missing rows."""
    for i in range(last_prog, current_prog-2):
        transformed[count] = missing_row(row, i)
        count += 1
    transformed[count] = [row['dayofservice'], row['tripid'], row['lineid'], row['routeid'], row['direction'], \
                    current_prog-1, np.nan, np.nan, current_prog, row['stoppointid'], row['actualtime_arr_stop']]
    count += 1
    return count, transformed

def missing_row(row, i):
    """Function that creates the format for a missing row."""
    return [row['dayofservice'], row['tripid'], row['lineid'], row['routeid'], row['direction'], \
                                            i+1, np.nan, np.nan, i+2, np.nan, np.nan]

def save_row(row, current_prog):
    """Function that creates the format for a row that should be saved."""
    return [row['dayofservice'], row['tripid'], row['lineid'], row['routeid'], row['direction'], \
                                        current_prog, row['stoppointid'], row['actualtime_arr_stop']]

def complete_missing(count, prog, last_row, transformed):
    """Function that completes a row with missing data."""
    transformed[count] = last_row + [prog + 1, np.nan, np.nan]
    count += 1
    return count, transformed

def complete_row(count, prog, row, last_row, transformed):
    """Function that completes a row with data from the current row."""
    transformed[count] = last_row + [prog, row['stoppointid'], row['actualtime_arr_stop']]
    count += 1
    return count, transformed

def build_dataframe(dict):
    """Function to build a dataframe from a dictionary."""
    return pd.DataFrame.from_dict(dict, orient='index', columns=['dayofservice', 'tripid', 'lineid', 'routeid', \
        'direction', 'progrnumber_first', 'stoppointid_first', 'actualtime_arr_stop_first', 'progrnumber_next', \
        'stoppointid_next', 'actualtime_arr_stop_next'])

def transform_segments(df):
    """Function that takes a dataframe as input and returns a new dataframe with the required format.
    
    This function is similar to transform_data() but does not add rows where all data is missing."""

    # the input dataframe is sorted
    df = df.sort_values(by=['dayofservice', 'tripid', 'progrnumber'])

    # a dict is created to store data for the new dataframe
    transformed = dict()

    # a count of row number is tracked, and is used as the key when inserting data into the dict
    count = 0

    # iterate through each row in the dataframe
    for index, row in df.iterrows():

        # the first row in the dataframe is a special case
        if index == 0:
            current_trip, current_prog = row["tripid"], row["progrnumber"]
            # save the relevant data from this row
            last_row = save_row(row, current_prog)
                
        # if it's not the first row...
        else:
            last_trip, last_prog = current_trip, current_prog
            current_trip, current_prog = row["tripid"], row["progrnumber"]

            # first check that we're still on the same trip
            if last_trip != current_trip:
                # save the relevant data from this row
                last_row = save_row(row, current_prog)

            # if it is the same trip as the last row...
            else:
                # check if prog has incremented by 1, if not we're missing data
                if current_prog - last_prog == 1:
                    # if we're not missing data, complete the last row with data from this row
                    count, transformed = complete_row(count, current_prog, row, last_row, transformed)
                # save the relevant data from this row
                last_row = save_row(row, current_prog)

    # build a new dataframe and return it
    return build_dataframe(transformed)