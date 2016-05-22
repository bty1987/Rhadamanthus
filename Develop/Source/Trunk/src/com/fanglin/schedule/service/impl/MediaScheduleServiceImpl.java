/**
 * @File Name		: MediaScheduleServiceImpl.java
 * @Package   	: com.fanglin.schedule.service.impl
 * @Version		: 1.0
 * @Date			: 2016-5-15
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.schedule.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.construction.dao.BricklayDrawingDao;
import com.fanglin.construction.dao.CarpentDrawingDao;
import com.fanglin.construction.dao.ChanDrawingDao;
import com.fanglin.construction.dao.CleaningDrawingDao;
import com.fanglin.construction.dao.GroundLevelingDrawingDao;
import com.fanglin.construction.dao.OilDrawingDao;
import com.fanglin.construction.dao.PutlineDrawingDao;
import com.fanglin.construction.dao.WaterwayCircuitCheckDrawingDao;
import com.fanglin.construction.dao.WaterwayCircuitPowerDrawingDao;
import com.fanglin.construction.po.BricklayDrawingPO;
import com.fanglin.construction.po.CarpentDrawingPO;
import com.fanglin.construction.po.ChanDrawingPO;
import com.fanglin.construction.po.CleaningDrawingPO;
import com.fanglin.construction.po.GroundLevelingDrawingPO;
import com.fanglin.construction.po.OilDrawingPO;
import com.fanglin.construction.po.PutlineDrawingPO;
import com.fanglin.construction.po.WaterwayCircuitCheckDrawingPO;
import com.fanglin.construction.po.WaterwayCircuitPowerDrawingPO;
import com.fanglin.dingding.utils.HttpHelper;
import com.fanglin.schedule.service.MediaScheduleService;
import com.fanglin.utils.SystemConfig;

@Service("mediaScheduleService")
@Transactional(readOnly=true)
public class MediaScheduleServiceImpl implements MediaScheduleService {
	
	@Autowired
	private ChanDrawingDao chanDrawingDao;
	
	@Autowired
	private PutlineDrawingDao putlineDrawingDao;
	
	@Autowired
	private WaterwayCircuitPowerDrawingDao waterwayCircuitPowerDrawingDao;
	
	@Autowired
	private BricklayDrawingDao bricklayDrawingDao;
	
	@Autowired
	private GroundLevelingDrawingDao groundLevelingDrawingDao;
	
	@Autowired
	private CarpentDrawingDao carpentDrawingDao;
	
	@Autowired
	private OilDrawingDao oilDrawingDao;
	
	@Autowired
	private WaterwayCircuitCheckDrawingDao waterwayCircuitCheckDrawingDao;
	
	@Autowired
	private CleaningDrawingDao cleaningDrawingDao;
	
	private final short DRAWING_TYPE_LOCAL_INT = 0;
	
	private final short DRAWING_TYPE_DING_INT = 1;

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int switchMediaForDing() {
		
		String strFormat = "%s%s?imageName=%s&uploadType=%d";
		
		String mediaHost = SystemConfig.getString("localMediaServer");
		String api = "downloadDDImage.do";
		
		List<ChanDrawingPO> chanDrawingPOs = chanDrawingDao.queryChanDrawingByType(DRAWING_TYPE_DING_INT);
		
		for(ChanDrawingPO chanDrawingPO: chanDrawingPOs){
			JSONObject json = HttpHelper.httpGet(String.format(strFormat, mediaHost, api, chanDrawingPO.getDrawingUrl(), 6));
			
			if(json != null && json.getString("generateName") != null){
				chanDrawingPO.setDrawingUrl(json.getString("generateName"));
				chanDrawingPO.setType(DRAWING_TYPE_LOCAL_INT);
				
				chanDrawingDao.update(chanDrawingPO);
			}
		}
		
		List<PutlineDrawingPO> putlineDrawingPOs = putlineDrawingDao.queryPutlineDrawingByType(DRAWING_TYPE_DING_INT);
		
		for(PutlineDrawingPO putlineDrawingPO: putlineDrawingPOs){
			JSONObject json = HttpHelper.httpGet(String.format(strFormat, mediaHost, api, putlineDrawingPO.getDrawingUrl(), 7));
			
			if(json != null && json.getString("generateName") != null){
				putlineDrawingPO.setDrawingUrl(json.getString("generateName"));
				putlineDrawingPO.setType(DRAWING_TYPE_LOCAL_INT);
				
				putlineDrawingDao.update(putlineDrawingPO);
			}
		}
		
		List<WaterwayCircuitPowerDrawingPO> waterwayCircuitPowerDrawingPOs = waterwayCircuitPowerDrawingDao.queryWaterwayCircuitPowerDrawingByType(DRAWING_TYPE_DING_INT);
		
		for(WaterwayCircuitPowerDrawingPO waterwayCircuitPowerDrawingPO: waterwayCircuitPowerDrawingPOs){
			JSONObject json = HttpHelper.httpGet(String.format(strFormat, mediaHost, api, waterwayCircuitPowerDrawingPO.getDrawingUrl(), 8));
			
			if(json != null && json.getString("generateName") != null){
				waterwayCircuitPowerDrawingPO.setDrawingUrl(json.getString("generateName"));
				waterwayCircuitPowerDrawingPO.setType(DRAWING_TYPE_LOCAL_INT);
				
				waterwayCircuitPowerDrawingDao.update(waterwayCircuitPowerDrawingPO);
			}
		}
		
		List<BricklayDrawingPO> bricklayDrawingPOs = bricklayDrawingDao.queryBricklayDrawingByType(DRAWING_TYPE_DING_INT);
		
		for(BricklayDrawingPO bricklayDrawingPO: bricklayDrawingPOs){
			JSONObject json = HttpHelper.httpGet(String.format(strFormat, mediaHost, api, bricklayDrawingPO.getDrawingUrl(), 9));
			
			if(json != null && json.getString("generateName") != null){
				bricklayDrawingPO.setDrawingUrl(json.getString("generateName"));
				bricklayDrawingPO.setType(DRAWING_TYPE_LOCAL_INT);
				
				bricklayDrawingDao.update(bricklayDrawingPO);
			}
		}
		
		List<GroundLevelingDrawingPO> groundLevelingDrawingPOs = groundLevelingDrawingDao.queryGroundLevelingDrawingByType(DRAWING_TYPE_DING_INT);
		
		for(GroundLevelingDrawingPO groundLevelingDrawingPO: groundLevelingDrawingPOs){
			JSONObject json = HttpHelper.httpGet(String.format(strFormat, mediaHost, api, groundLevelingDrawingPO.getDrawingUrl(), 10));
			
			if(json != null && json.getString("generateName") != null){
				groundLevelingDrawingPO.setDrawingUrl(json.getString("generateName"));
				groundLevelingDrawingPO.setType(DRAWING_TYPE_LOCAL_INT);
				
				groundLevelingDrawingDao.update(groundLevelingDrawingPO);
			}
		}
		
		List<CarpentDrawingPO> carpentDrawingPOs = carpentDrawingDao.queryCarpentDrawingByType(DRAWING_TYPE_DING_INT);
		
		for(CarpentDrawingPO carpentDrawingPO: carpentDrawingPOs){
			JSONObject json = HttpHelper.httpGet(String.format(strFormat, mediaHost, api, carpentDrawingPO.getDrawingUrl(), 11));
			
			if(json != null && json.getString("generateName") != null){
				carpentDrawingPO.setDrawingUrl(json.getString("generateName"));
				carpentDrawingPO.setType(DRAWING_TYPE_LOCAL_INT);
				
				carpentDrawingDao.update(carpentDrawingPO);
			}
		}
		
		List<OilDrawingPO> oilDrawingPOs = oilDrawingDao.queryOilDrawingByType(DRAWING_TYPE_DING_INT);
		
		for(OilDrawingPO oilDrawingPO: oilDrawingPOs){
			JSONObject json = HttpHelper.httpGet(String.format(strFormat, mediaHost, api, oilDrawingPO.getDrawingUrl(), 12));
			
			if(json != null && json.getString("generateName") != null){
				oilDrawingPO.setDrawingUrl(json.getString("generateName"));
				oilDrawingPO.setType(DRAWING_TYPE_LOCAL_INT);
				
				oilDrawingDao.update(oilDrawingPO);
			}
		}
		
		List<WaterwayCircuitCheckDrawingPO> waterwayCircuitCheckDrawingPOs = waterwayCircuitCheckDrawingDao.queryWaterwayCircuitCheckDrawingByType(DRAWING_TYPE_DING_INT);
		
		for(WaterwayCircuitCheckDrawingPO waterwayCircuitCheckDrawingPO: waterwayCircuitCheckDrawingPOs){
			JSONObject json = HttpHelper.httpGet(String.format(strFormat, mediaHost, api, waterwayCircuitCheckDrawingPO.getDrawingUrl(), 13));
			
			if(json != null && json.getString("generateName") != null){
				waterwayCircuitCheckDrawingPO.setDrawingUrl(json.getString("generateName"));
				waterwayCircuitCheckDrawingPO.setType(DRAWING_TYPE_LOCAL_INT);
				
				waterwayCircuitCheckDrawingDao.update(waterwayCircuitCheckDrawingPO);
			}
		}
		
		List<CleaningDrawingPO> cleaningDrawingPOs = cleaningDrawingDao.queryCleaningDrawingByType(DRAWING_TYPE_DING_INT);
		
		for(CleaningDrawingPO cleaningDrawingPO: cleaningDrawingPOs){
			JSONObject json = HttpHelper.httpGet(String.format(strFormat, mediaHost, api, cleaningDrawingPO.getDrawingUrl(), 14));
			
			if(json != null && json.getString("generateName") != null){
				cleaningDrawingPO.setDrawingUrl(json.getString("generateName"));
				cleaningDrawingPO.setType(DRAWING_TYPE_LOCAL_INT);
				
				cleaningDrawingDao.update(cleaningDrawingPO);
			}
		}
		
		return 0;
	}
	
	

}
