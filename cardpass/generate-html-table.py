#!/usr/bin/python

def main():
	#for i in range(0,10):
	#	print nextRandChar3()
	
	horzIndex = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	vertIndex = '1234567890'
	
	W = 8
	H = 8
	
	#A table for both sides of the card (1 and 2)
	for sideNum in range(1, 3):
			
		print '<!-- side %d of the card -->' % sideNum
		print '<table border="0" cellspacing="0">'
		print '<tr>'
		print '<td>&nbsp;</td>'
		
		for c in range(0, W):
			print '\t<td id="s%d_hc%d" class="horzCoord">%s</td>' % (sideNum, c, horzIndex[(sideNum-1) * W + c])
		print '</tr>'
		
		for r in range(0, H):
			print '<tr class="%s">' % ('even' if (r & 1) == 0 else 'odd')
			print '\t<td id="s%d_vc%d" class="vertCoord">%s</td>' % (sideNum, r, vertIndex[r])
			for c in range(0, W):
				print '\t<td id="s%d_rc%d%d" class="randCell">&nbsp;&nbsp;&nbsp;</td>' % (sideNum, r, c)
			print '</tr>'			
		print '</table>'
	
if __name__ == '__main__':	
	main()
