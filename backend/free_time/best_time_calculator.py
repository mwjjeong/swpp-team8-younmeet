from .time_count_tree import TimeCountTree
from .best_time_heap import BestTimeHeap


class BestTimeCalculator:
    def __init__(self, min_time_required, min_people, k=3):
        # k denotes how many times to show
        self.min_time_required = min_time_required
        self.min_people = min_people
        self.time_count_tree = TimeCountTree()
        self.k = k
        self.best_k_times = BestTimeHeap()

    def calculate_best_times(self):
        time_node_list = self.time_count_tree.append_inorder(self.min_people)
        i = 0
        while i < len(time_node_list):
            time_node = time_node_list[i]
            new_best_time = BestTimeCalculator.BestTime(time_node)
            j = i + 1
            while j < len(time_node_list):
                next_time = time_node_list[j]
                if next_time.start != new_best_time.end:
                    break
                new_best_time.expand_best_time(next_time)
                j += 1
            if new_best_time.end - new_best_time.start >= self.min_time_required \
                    and len(new_best_time.full_attend) >= self.min_people:
                self.best_k_times.insert(new_best_time)
            i = j

    # inputs list of pair (start, end)
    def insert_time(self, time_list):
        for time in time_list:
            self.time_count_tree.insert(time[0], time[1], time[2])
            # inserting (start_time, end_time, member)

    def get_best_times(self):
        times = []
        while self.best_k_times.size > 0:
            times.append(self.best_k_times.extract_max())
        return times

    def get_k_best_times(self):
        k_times = []
        for k in range(self.k):
            k_times.append(self.best_k_times.extract_max())
        return k_times

    class BestTime(object):
        def __init__(self, time_node):
            self.start = time_node.start
            self.end = time_node.end
            self.full_attend = set(time_node.members)
            self.partial_attend = dict()
            self.weight = self.calculate_weight()

        def __str__(self):
            msg = ''
            msg += 'starttime:'
            msg += str(self.start)
            msg += '\nendtime:'
            msg += str(self.end)
            msg += '\nfull_attend:'
            msg += str(self.full_attend)
            msg += '\npartial_attend'
            msg += str(self.partial_attend)
            return msg

        def calculate_weight(self):
            weight = 0
            weight += (BestTimeCalculator.time_delta_to_minute(self.end - self.start) * len(self.full_attend) ** 1.5)
            for time_node in self.partial_attend.values():
                weight += BestTimeCalculator.time_delta_to_minute(time_node['end'] - time_node['start'])
            return weight

        def expand_best_time(self, new_time_node):
            # Try to expand current best time with given time_node
            remove_members = set(filter(lambda person: person not in new_time_node.members, self.full_attend))

            self.full_attend.difference_update(remove_members)

            for member in remove_members:
                self.partial_attend[member] = {
                    'start': self.start,
                    'end': self.end
                }

            partial_members_in_new_time_node = set(
                filter(lambda person: person in new_time_node.members, self.partial_attend.keys()))

            for member in partial_members_in_new_time_node:
                before_available_time = self.partial_attend[member]
                if before_available_time['end'] == new_time_node.start:
                    # Can expand time
                    self.partial_attend[member]['start'] = before_available_time['start']
                    self.partial_attend[member]['end'] = new_time_node.end
                else:
                    # Take longer time
                    if new_time_node.end - new_time_node.start > \
                            before_available_time['end'] - before_available_time['start']:
                        self.partial_attend[member]['start'] = new_time_node.start
                        self.partial_attend[member]['end'] = new_time_node.end

            new_members = set(
                filter(lambda person: person not in self.partial_attend.keys() and person not in self.full_attend,
                       new_time_node.members))

            for member in new_members:
                self.partial_attend[member] = dict()
                self.partial_attend[member]['start'] = new_time_node.start
                self.partial_attend[member]['end'] = new_time_node.end

            self.end = new_time_node.end
            self.weight = self.calculate_weight()

    @staticmethod
    def time_delta_to_minute(time_delta):
        return time_delta.days * 24 * 60 + time_delta.seconds / 60
