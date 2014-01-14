'''
We use the equation from exponential decay to clean up our inbox:
http://en.wikipedia.org/wiki/Exponential_decay

We also compute the half-life, which is the time required for the inbox
to fall to one half of its initial value.
'''

from datetime import datetime, timedelta
import math

'''
Input data
'''

# Number of initial emails
first_day = 86

# Wished emails at the end of the period (not zero)
last_day = 10

# Total days for the process
total_days = 18

'''
Nothing to change after this
'''

def get_decay_rate(total_days, last_day, first_day):
    return (-1.0 / total_days) * math.log(1.0 * last_day / first_day)

def get_exponential_decay(initial_quantity, decay_rate, day):
    return 1.0 * initial_quantity * math.exp(-1.0 * decay_rate * day)

def get_half_life(decay_rate):
    return 1.0 * math.log(2.0) / decay_rate

decay_rate = get_decay_rate(total_days, last_day, first_day)
print 'Decay rate = %f' % decay_rate

half_life = get_half_life(decay_rate)
print 'Half-life = %d days' % math.ceil(half_life)

today = datetime.now()

print '\nPlan:'
for day in range(0, total_days + 1):
    remaining = math.ceil(get_exponential_decay(first_day, decay_rate, day))
    target_day = (today + timedelta(days=day)).strftime('%d %b')
    print '* Day %d (%s): %d emails' % (day, target_day, remaining)
