/**
 * @File Name		: WaterwayCircuitCheckDrawingServiceImpl.java
 * @Package   	: com.fanglin.service.constructionSchedule.impl
 * @Version		: 1.0
 * @Date			: 2015-4-9
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.dao.WaterwayCircuitCheckDrawingDao;
import com.fanglin.construction.po.WaterwayCircuitCheckDrawingPO;
import com.fanglin.construction.service.WaterwayCircuitCheckDrawingService;
import com.fanglin.construction.vo.WaterwayCircuitCheckDrawingVO;
import com.fanglin.utils.BeanUtil;

@Service("waterwayCircuitCheckDrawingService")
@Transactional(readOnly=true)
public class WaterwayCircuitCheckDrawingServiceImpl implements WaterwayCircuitCheckDrawingService {
	
	@Autowired
	private WaterwayCircuitCheckDrawingDao waterwayCircuitCheckDrawingDao;

	@Override
	public WaterwayCircuitCheckDrawingVO queryWaterwayCircuitCheckDrawingById(int wcpdId){
		
		WaterwayCircuitCheckDrawingPO waterwayCircuitCheckDrawingPO = waterwayCircuitCheckDrawingDao.get(wcpdId);
		WaterwayCircuitCheckDrawingVO waterwayCircuitCheckDrawingVO = new WaterwayCircuitCheckDrawingVO();
		
		BeanUtil.copyProperties(waterwayCircuitCheckDrawingPO, waterwayCircuitCheckDrawingVO);
		
		return waterwayCircuitCheckDrawingVO;
	}

	@Override
	public List<WaterwayCircuitCheckDrawingVO> queryWaterwayCircuitCheckDrawingByCsId(WaterwayCircuitCheckDrawingVO waterwayCircuitCheckDrawingVO) {
		
		long csId = waterwayCircuitCheckDrawingVO.getCsId();
		List<WaterwayCircuitCheckDrawingPO> waterwayCircuitCheckDrawingPOs = waterwayCircuitCheckDrawingDao.queryWaterwayCircuitCheckDrawingByCsId(csId);
		List<WaterwayCircuitCheckDrawingVO> waterwayCircuitCheckDrawingVOs = new ArrayList<WaterwayCircuitCheckDrawingVO>();
		
		for(WaterwayCircuitCheckDrawingPO waterwayCircuitCheckDrawingPO: waterwayCircuitCheckDrawingPOs){
			WaterwayCircuitCheckDrawingVO _waterwayCircuitCheckDrawingVO = new WaterwayCircuitCheckDrawingVO();
			BeanUtil.copyProperties(waterwayCircuitCheckDrawingPO, _waterwayCircuitCheckDrawingVO);
			
			waterwayCircuitCheckDrawingVOs.add(_waterwayCircuitCheckDrawingVO);
		}
		
		return waterwayCircuitCheckDrawingVOs;
	}

	@Override
	public List<WaterwayCircuitCheckDrawingVO> queryWaterwayCircuitCheckDrawingByWcccsId(WaterwayCircuitCheckDrawingVO waterwayCircuitCheckDrawingVO){
		
		int cccsId = waterwayCircuitCheckDrawingVO.getWcccsId();
		List<WaterwayCircuitCheckDrawingPO> waterwayCircuitCheckDrawingPOs = waterwayCircuitCheckDrawingDao.queryWaterwayCircuitCheckDrawingByWcccsId(cccsId);
		List<WaterwayCircuitCheckDrawingVO> waterwayCircuitCheckDrawingVOs = new ArrayList<WaterwayCircuitCheckDrawingVO>();
		
		for(WaterwayCircuitCheckDrawingPO waterwayCircuitCheckDrawingPO: waterwayCircuitCheckDrawingPOs){
			WaterwayCircuitCheckDrawingVO _waterwayCircuitCheckDrawingVO = new WaterwayCircuitCheckDrawingVO();
			BeanUtil.copyProperties(waterwayCircuitCheckDrawingPO, _waterwayCircuitCheckDrawingVO);
			
			waterwayCircuitCheckDrawingVOs.add(_waterwayCircuitCheckDrawingVO);
		}
		
		return waterwayCircuitCheckDrawingVOs;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int saveOrUpdateWaterwayCircuitCheckDrawing(WaterwayCircuitCheckDrawingVO waterwayCircuitCheckDrawingVO){
		WaterwayCircuitCheckDrawingPO waterwayCircuitCheckDrawingPO = null;
		
		if(waterwayCircuitCheckDrawingVO.getWccdId() == null || waterwayCircuitCheckDrawingVO.getWccdId() == 0){
			waterwayCircuitCheckDrawingPO = new WaterwayCircuitCheckDrawingPO();
		}else{
			waterwayCircuitCheckDrawingPO = waterwayCircuitCheckDrawingDao.get(waterwayCircuitCheckDrawingVO.getWccdId());
		}
		
		BeanUtil.copyProperties(waterwayCircuitCheckDrawingVO, waterwayCircuitCheckDrawingPO);
		
		waterwayCircuitCheckDrawingDao.saveOrUpdate(waterwayCircuitCheckDrawingPO);
		
		waterwayCircuitCheckDrawingVO.setWccdId(waterwayCircuitCheckDrawingPO.getWccdId());
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public List<WaterwayCircuitCheckDrawingVO> addwaterWaterwayCircuitCheckDrawings(WaterwayCircuitCheckDrawingVO waterwayCircuitCheckDrawingVO, List<String> drawingUrls) {
		
		List<WaterwayCircuitCheckDrawingVO> waterwayCircuitCheckDrawingVOs = new ArrayList<WaterwayCircuitCheckDrawingVO>();
		
		for(String drawingUrl: drawingUrls){
			
			WaterwayCircuitCheckDrawingPO waterwayCircuitCheckDrawingPO = new WaterwayCircuitCheckDrawingPO();
			
			BeanUtil.copyProperties(waterwayCircuitCheckDrawingVO, waterwayCircuitCheckDrawingPO);
			waterwayCircuitCheckDrawingPO.setDrawingUrl(drawingUrl);
			
			waterwayCircuitCheckDrawingDao.save(waterwayCircuitCheckDrawingPO);
			
			WaterwayCircuitCheckDrawingVO _waterwayCircuitCheckDrawingVO = new WaterwayCircuitCheckDrawingVO();
			BeanUtil.copyProperties(waterwayCircuitCheckDrawingPO, _waterwayCircuitCheckDrawingVO);
			
			waterwayCircuitCheckDrawingVOs.add(_waterwayCircuitCheckDrawingVO);
		}
		
		return waterwayCircuitCheckDrawingVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteWaterwayCircuitCheckDrawingByWccdId(WaterwayCircuitCheckDrawingVO waterwayCircuitCheckDrawing){
		waterwayCircuitCheckDrawingDao.deleteById(waterwayCircuitCheckDrawing.getWccdId());
	}

}
