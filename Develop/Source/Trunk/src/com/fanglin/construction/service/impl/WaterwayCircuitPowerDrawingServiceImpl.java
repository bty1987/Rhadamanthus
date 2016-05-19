/**
 * @File Name		: WaterwayCircuitPowerDrawingServiceImpl.java
 * @Package   	: com.fanglin.service.impl.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-27
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

import com.fanglin.construction.dao.WaterwayCircuitPowerDrawingDao;
import com.fanglin.construction.po.WaterwayCircuitPowerDrawingPO;
import com.fanglin.construction.service.WaterwayCircuitPowerDrawingService;
import com.fanglin.construction.vo.WaterwayCircuitPowerDrawingVO;
import com.fanglin.utils.BeanUtil;

@Service("waterwayCircuitPowerDrawingService")
@Transactional(readOnly=true)
public class WaterwayCircuitPowerDrawingServiceImpl implements WaterwayCircuitPowerDrawingService {
	
	@Autowired
	private WaterwayCircuitPowerDrawingDao waterwayCircuitPowerDrawingDao;

	@Override
	public WaterwayCircuitPowerDrawingVO queryWaterwayCircuitPowerDrawingById(int wcpdId){
		
		WaterwayCircuitPowerDrawingPO waterwayCircuitPowerDrawingPO = waterwayCircuitPowerDrawingDao.get(wcpdId);
		WaterwayCircuitPowerDrawingVO waterwayCircuitPowerDrawingVO = new WaterwayCircuitPowerDrawingVO();
		
		BeanUtil.copyProperties(waterwayCircuitPowerDrawingPO, waterwayCircuitPowerDrawingVO);
		
		return waterwayCircuitPowerDrawingVO;
	}

	@Override
	public List<WaterwayCircuitPowerDrawingVO> queryWaterwayCircuitPowerDrawingByCsId(WaterwayCircuitPowerDrawingVO waterwayCircuitPowerDrawingVO) {
		
		List<WaterwayCircuitPowerDrawingPO> waterwayCircuitPowerDrawingPOs = waterwayCircuitPowerDrawingDao.queryWaterwayCircuitPowerDrawingByCsId(waterwayCircuitPowerDrawingVO.getCsId());
		List<WaterwayCircuitPowerDrawingVO> waterwayCircuitPowerDrawingVOs = new ArrayList<WaterwayCircuitPowerDrawingVO>();
		
		for(WaterwayCircuitPowerDrawingPO waterwayCircuitPowerDrawingPO: waterwayCircuitPowerDrawingPOs){
			WaterwayCircuitPowerDrawingVO _waterwayCircuitPowerDrawingVO = new WaterwayCircuitPowerDrawingVO();
			BeanUtil.copyProperties(waterwayCircuitPowerDrawingPO, _waterwayCircuitPowerDrawingVO);
			
			waterwayCircuitPowerDrawingVOs.add(_waterwayCircuitPowerDrawingVO);
		}
		
		return waterwayCircuitPowerDrawingVOs;
	}

	@Override
	public List<WaterwayCircuitPowerDrawingVO> queryWaterwayCircuitPowerDrawingByWcpcsId(WaterwayCircuitPowerDrawingVO waterwayCircuitPowerDrawingVO){
		
		List<WaterwayCircuitPowerDrawingPO> waterwayCircuitPowerDrawingPOs = waterwayCircuitPowerDrawingDao.queryWaterwayCircuitPowerDrawingByWcpcsId(waterwayCircuitPowerDrawingVO.getWcpcsId());
		List<WaterwayCircuitPowerDrawingVO> waterwayCircuitPowerDrawingVOs = new ArrayList<WaterwayCircuitPowerDrawingVO>();
		
		for(WaterwayCircuitPowerDrawingPO waterwayCircuitPowerDrawingPO: waterwayCircuitPowerDrawingPOs){
			WaterwayCircuitPowerDrawingVO _waterwayCircuitPowerDrawingVO = new WaterwayCircuitPowerDrawingVO();
			BeanUtil.copyProperties(waterwayCircuitPowerDrawingPO, _waterwayCircuitPowerDrawingVO);
			
			waterwayCircuitPowerDrawingVOs.add(_waterwayCircuitPowerDrawingVO);
		}
		
		return waterwayCircuitPowerDrawingVOs;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int saveOrUpdateWaterwayCircuitPowerDrawing(WaterwayCircuitPowerDrawingVO waterwayCircuitPowerDrawingVO){
		
		WaterwayCircuitPowerDrawingPO waterwayCircuitPowerDrawingPO = null;
		
		if(waterwayCircuitPowerDrawingVO.getWcpdId() == null || waterwayCircuitPowerDrawingVO.getWcpdId() == 0){
			waterwayCircuitPowerDrawingPO = new WaterwayCircuitPowerDrawingPO();
		}else{
			waterwayCircuitPowerDrawingPO = waterwayCircuitPowerDrawingDao.get(waterwayCircuitPowerDrawingVO.getWcpdId());
		}
		
		BeanUtil.copyProperties(waterwayCircuitPowerDrawingVO, waterwayCircuitPowerDrawingPO);
		
		waterwayCircuitPowerDrawingDao.saveOrUpdate(waterwayCircuitPowerDrawingPO);
		
		waterwayCircuitPowerDrawingVO.setWcpdId(waterwayCircuitPowerDrawingPO.getWcpdId());
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public List<WaterwayCircuitPowerDrawingVO> addWaterwayCircuitPowerDrawings(WaterwayCircuitPowerDrawingVO waterwayCircuitPowerDrawingVO, List<String> drawingUrls) {
		
		List<WaterwayCircuitPowerDrawingVO> waterwayCircuitPowerDrawingVOs = new ArrayList<WaterwayCircuitPowerDrawingVO>();
		
		for(String drawingUrl: drawingUrls){
			
			WaterwayCircuitPowerDrawingPO waterwayCircuitPowerDrawingPO = new WaterwayCircuitPowerDrawingPO();
			
			BeanUtil.copyProperties(waterwayCircuitPowerDrawingVO, waterwayCircuitPowerDrawingPO);
			waterwayCircuitPowerDrawingPO.setDrawingUrl(drawingUrl);
			
			waterwayCircuitPowerDrawingDao.save(waterwayCircuitPowerDrawingPO);
			
			WaterwayCircuitPowerDrawingVO _waterwayCircuitPowerDrawingVO = new WaterwayCircuitPowerDrawingVO();
			BeanUtil.copyProperties(waterwayCircuitPowerDrawingPO, _waterwayCircuitPowerDrawingVO);
			
			waterwayCircuitPowerDrawingVOs.add(_waterwayCircuitPowerDrawingVO);
		}
		
		return waterwayCircuitPowerDrawingVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteWaterwayCircuitPowerDrawingByWcpdId(WaterwayCircuitPowerDrawingVO waterwayCircuitPowerDrawing){
		
		waterwayCircuitPowerDrawingDao.deleteById(waterwayCircuitPowerDrawing.getWcpdId());
		
	}

}
