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
                if int(current_prog) - int(last_prog) == 1:
                    # if we're not missing data, complete the last row with data from this row
                    count, transformed = complete_row(count, current_prog, row, last_row, transformed)
                # save the relevant data from this row
                last_row = save_row(row, current_prog)

    # build a new dataframe and return it
    return build_dataframe(transformed)

def save_row(row, current_prog):
    """Function that creates the format for a row that should be saved."""
    return [row['dayofservice'], row['tripid'], row['lineid'], \
                                        current_prog, row['stoppointid'], row['actualtime_arr_stop']]

def complete_row(count, prog, row, last_row, transformed):
    """Function that completes a row with data from the current row."""
    transformed[count] = last_row + [prog, row['stoppointid'], row['actualtime_arr_stop']]
    count += 1
    return count, transformed

def build_dataframe(dict):
    """Function to build a dataframe from a dictionary."""
    return pd.DataFrame.from_dict(dict, orient='index', columns=['dayofservice', 'tripid', 'lineid', \
        'progrnumber_first', 'stoppointid_first', 'actualtime_arr_stop_first', 'progrnumber_next', \
        'stoppointid_next', 'actualtime_arr_stop_next'])