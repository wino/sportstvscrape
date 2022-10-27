<?php
echo '<html>
<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>Futbol</title>

</head><body>
<form id="theform" name="theform" action="scrape.php#submit" method="post">
<input type="hidden" name="todo" id="todo" value="">
<input type="hidden" name="game" id="game" value="">
';

$res = array();
$showNcaaDate = @$_GET['showNcaaDate'];
$showNcaafDate = @$_GET['showNcaafDate'];
$showNhlDate = @$_GET['showNhlDate'];
$showEplDate = @$_GET['showEplDate'];
$showUclDate = @$_GET['showUclDate'];
$numdays = @$_GET['numdays'] ? $_GET['numdays'] : 1;
$numdaysstr = "+$numdays days";
$ncaaDate = 'today';//date('Ymd');//, strtotime('this Saturday'));
$nextNcaaDate = date('Ymd', strtotime($numdaysstr, strtotime($ncaaDate)));
$ncaafDate = date('Ymd');;
$nhlDate = date('Ymd');//, strtotime('this Saturday'));
$nextNhlDate = date('Ymd', strtotime($numdaysstr, strtotime($nhlDate)));
$eplDate = date('Ymd', strtotime('this Saturday'));
$nextEplDate = date('Ymd', strtotime($numdaysstr, strtotime($eplDate)));
$uclDate = date('Ymd', strtotime('this Tuesday'));
$nextUclDate = date('Ymd', strtotime($numdaysstr, strtotime($eplDate)));
echo '<table><tr><td><!--input type="button" onClick="document.theform.todo.value=\'makenote\';document.theform.submit()" value="Update Note"-->
<a href="?showNcaaDate='.$ncaaDate.'&numdays=1">Show NCAAM Schedule</a>
<a href="?showNcaafDate='.$ncaafDate.'">Show NCAAF Schedule</a>
&nbsp;<a href="?showNhlDate='.$nhlDate.'&numdays='.$numdays.'">Show NHL Schedule</a><!--&nbsp;<a href="?showNhlDate='.$nextNhlDate.'">Show Next Nhl Schedule</a-->
&nbsp;<a href="?showEplDate='.$eplDate.'">Show EPL Schedule</a>&nbsp;<a href="?showEplDate='.$nextEplDate.'&numdays='.$numdays.'">Show Next EPL Schedule</a>
&nbsp;<a href="?showUclDate='.$uclDate.'">Show UCL Schedule</a>&nbsp;<a href="?showUclDate='.$nextUclDate.'&numdays='.$numdays.'">Show Next UCL Schedule</a><br>
</td></tr><tr>';

if ($showNcaaDate || $showNcaafDate || $showNhlDate || $showEplDate || $showUclDate) {
	echo "<td><table>\n";
	$date = $showEplDate ? $showEplDate : ($showUclDate ? $showUclDate : ($showNcaaDate ? $showNcaaDate : ($showNcaafDate ? $showNcaafDate : $showNhlDate))); 
	$end_date = date('Ymd', strtotime($numdaysstr, strtotime($date)));

	$dates = array();
	while (strtotime($date) < strtotime($end_date)) {
		$date2 = date('D Y-m-d', strtotime($date));
		if ($showEplDate) {
			$contentsArr = file('http://scores.nbcsports.com/epl/scoreboard_daily.asp?gameday='.$date);
		} else if ($showUclDate) {
			$contentsArr = file('http://scores.nbcsports.com/chlg/scoreboard_daily.asp?gameday='.$date);
		} else if ($showNcaaDate) {
			$contents = file_get_contents('http://www.espn.com/mens-college-basketball/schedule/_/date/'.$date);
			$contentsArr = array();
		} else if ($showNcaafDate) {
			$contents = file_get_contents('http://www.espn.com/college-football/schedule');
			$contentsArr = array();
		} else {
			$contents = file_get_contents('http://www.espn.com/nhl/schedule/_/date/'.$date);
			$contentsArr = array();
		}

		$rows = array();
		/*if ($showNcaaDate) {
			// NCAAM bball
			$doc = new DOMDocument;
			$doc->loadHtml($contents);
			$xp = new DomXPath($doc);
			$el = $xp->query("//table[contains(@class, 'Table')]");
			$xml = simplexml_import_dom($el->item(0));
			foreach ($xml->tbody->tr as $r) {
				$tv = $r->td[3];
				if (@$tv->div[0]->a) {
					foreach ($tv->div[0]->a->figure->attributes() as $k=>$v) {
						if ($k=='class') {
							$pos = strpos($v, 'network-');
							$tv = substr($v, $pos+8);
							break;
						}
					}
				}
				else $tv = $r->td[3]->div[0]->div;
				if (!$tv) {
					$tv = '';
var_dump($r->td[3]->div->a[0]);
					for ($im = 0; $im <= 1; $im++) {
						$a = @$r->td[3]->div->a[$im];
						if ($a) {
echo "found a<br>";
							$img = @$r->td[3]->div->a[$im]->figure->div[1]->img;
							if ($img) $tv .= $img->attributes();
							else {
echo "didnt find img";
								$img = @$r->td[3]->div->a[$im]->img;
								if ($img) $tv .= $img->attributes();
							}
						} else echo "noa$im";
						$tv .= ' ';
					}
				}
				$tv = strtoupper(trim($tv));
				if ($tv == 'ESPN3' || $tv == 'PAC12' || $tv == 'SECN+' || $tv == 'LHN' || $tv == 'BIG12' || $tv == 'BIG12|ESPN+') {
					continue;
				} else if ($tv == '' && !@$_GET['notv']) {
					continue;
				}
				if ($tv == 'FS2') {
					$tv = "X $tv";
				}
				$away = $r->td[0]->div->span->a[1];
				$awayrank = @$r->td[0]->div->span->span;
				$home = $r->td[1]->div->span[1]->a[1];
				$homerank = @$r->td[1]->div->span[1]->span;
				$time = $r->td[2]->a;//div->span->a[1];
				$rows[] = array($awayrank.$away, $homerank.$home, $time, $tv);
			}
		} else*/ if ($showNcaaDate || $showNcaafDate) {
			$doc = new DOMDocument;
			@$doc->loadHtml($contents);
			$xp = new DomXPath($doc);
			$el = $xp->query("//table[contains(@class, 'Table')]");
			for ($i=0; $i<$el->length; $i++) {
				$xml = simplexml_import_dom($el->item($i));
				foreach ($xml->tbody->tr as $r) {
					$tv = $r->td[3]->div->div;
					if (!$tv) {
						$tv = '';
						for ($im = 0; $im <= 1; $im++) {
							$a = @$r->td[3]->div->a[$im];
							if ($a) {
								$img = @$r->td[3]->div->a[$im]->figure->div[1]->img;
								if ($img) $tv .= $img->attributes();
								else {
									$img = @$r->td[3]->div->a[$im]->img;
									if ($img) $tv .= $img->attributes();
								}
							}
							$tv .= ' ';
						}
					}
					$tv = trim($tv);
					if ($tv == '' || $tv == 'ESPN3' || $tv == 'PAC12' || $tv == 'ESPN+') { 
						continue;
					} 
					$away = $r->td[0]->div->span->a[1];
					$awayrank = @$r->td[0]->div->span->span;
					$home = $r->td[1]->div->span[1]->a[1];
					$homerank = @$r->td[1]->div->span[1]->span;
					$time = $r->td[2]->a;
					foreach ($time->attributes() as $k=>$v) {
						if($k=='data-date') {
							$time = date('h:i A', strtotime($v));
							break;
						}
					}
					$rows[] = array($awayrank.$away, $homerank.$home, $time, $tv);
				} 
				$rows[] = array('<hr>');
			} 
		} else if ($showNhlDate) {
			$doc = new DOMDocument;
			$doc->loadHtml($contents);
			$xp = new DomXPath($doc);
			$el = $xp->query("//div[contains(@class, 'ScheduleTables')]");
			for ($i=0; $i<$el->length; $i++) {
				$xml = simplexml_import_dom($el->item($i));
				foreach ($xml->div[0]->div[1]->div->div[1]->table->tbody->tr as $tr) {
					$row = array();
					$useRow = 0;
					$r = $tr->td;
					$team1 = $r[0]->div->span->a[1];
					$team2 = $r[1]->div->span[1]->a[1];
					$time = $r[2]->a;
					$tv = $r[3]->div;
					if ($tv->a) { 
						$a = $tv->a->attributes();
						if (strpos($a['href'], 'espnplus') !== false) $tv = 'ESPN+';
						else {
							foreach ($tv->a->figure->div[1]->img->attributes() as $k=>$v) {
								if ($k=='alt') {
									$tv = $v;
									break;
								}
							}
						}
					}
					else if ($tv->div) $tv = $tv->div;
					$useRow = (bool)$tv;
					if (!$useRow) continue;
					
					$rows[] = array($team1, $team2, $time, $tv);
				}
				$rowdate = date('D Y-m-d', strtotime('+'.($i+1).' days', strtotime($date)));
				$rows[] = array($rowdate);
				unset($row);
			}
		}

		$noEcho = 0;
		foreach ($contentsArr as $content) {
			if (strpos($content, 'No Games Scheduled')) {
				$noEcho = 1;
				break;
			}
			$time = 'dummy';
			if (substr($content, 0, 30) == '</tr><tr style="height: 22px">') {
				$content = substr($content, 30);
			}
			switch (substr($content, 0, 46)) {
				case '<td class="shsNumD"><span class="shsTVChannels':
					$pos = strpos($content, '"', 135);
					$tv = substr($content, 135, $pos-135);
					if ($tv == 'TV: ') $tv = '';
					$row[] = $tv;
					break;
				case '<td class="shsNamD shsHomeTeam" style="width: ';
				case '<td class="shsNumD shsAwayTeam" style="width: ';
					$pos = strrpos($content, '">');
					$pos2 = strpos($content, '</a>', $pos+2);
					$row[] = substr($content, $pos+2, $pos2-$pos-2);
					break;
				default:
					if (substr($content, 0, 81) == '<td class="shsNamD" style="text-align: left" colspan="2"><span class="shsTimezone') {
						if (isset($row)) {
							if (count($row) == 2) {
								$row[2] = $row[1];
								$row[1] = $row[0];
								$row[0] = 'Started';
							}
							$rows[] = $row;
						}
						$row = array();
						$pos = strpos($content, '<span class="shsTimezone shsETZone">');
						$time = substr($content, $pos+36, strpos($content, '</span>', $pos+36)-$pos-36);
						$row[] = $time;
					}
					break;
			}
		}
		if (!$noEcho) {
			if (isset($row)) {
				if (count($row) == 2) {
					$row[2] = $row[1];
					$row[1] = $row[0];
					$row[0] = 'Started';
				}
				$rows[] = $row;
				$row = null;
			}
			$dates[$date2] = $rows;
		}
		$date = date('Ymd', strtotime('+1 day', strtotime($date)));
	}
	foreach ($dates as $date => $games) {
		if (empty($games)) {
			echo "<tr><td colspan=5><hr></td></tr>\n";
			continue;
		}
		echo "<tr><td colspan=5><br>$date</td></tr>\n";
		foreach ($games as $game) {
			if (count($game)>3) echo "<tr><td>$game[0]</td><td>$game[1]</td><td>$game[2]</td><td>$game[3]</td></tr>\n";
			else echo "<tr><td colspan=4>$game[0]</td></tr>\n";
		}
	}
	echo '</table></td>';
}
echo '</tr></table>';

echo '</form></body></html>';
?>
