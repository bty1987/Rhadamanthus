/**
 * @File Name		: OilDrawingServiceImpl.java
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

import com.fanglin.construction.dao.OilDrawingDao;
import com.fanglin.construction.po.OilDrawingPO;
import com.fanglin.construction.service.OilDrawingService;
import com.fanglin.construction.vo.OilDrawingVO;
import com.fanglin.utils.BeanUtil;

@Service("oilDrawingService")
@Transactional(rollbackFor=Exception.class)
public class OilDrawingServiceImpl implements OilDrawingService {
	
	@Autowired
	private OilDrawingDao oilDrawingDao;

	@Override
	public OilDrawingVO queryOilDrawingById(int odId){
		
		OilDrawingPO oilDrawingPO = oilDrawingDao.get(odId);
		OilDrawingVO oilDrawingVO = new OilDrawingVO();
		
		BeanUtil.copyProperties(oilDrawingPO, oilDrawingVO);
		
		return oilDrawingVO;
	}

	@Override
	public List<OilDrawingVO> queryOilDrawingByCsId(OilDrawingVO oilDrawingVO) {
		
		List<OilDrawingPO> oilDrawingPOs = oilDrawingDao.queryOilDrawingByCsId(oilDrawingVO.getCsId());
		List<OilDrawingVO> oilDrawingVOs = new ArrayList<OilDrawingVO>();
		
		for(OilDrawingPO oilDrawingPO: oilDrawingPOs){
			OilDrawingVO _oilDrawingVO = new OilDrawingVO();
			BeanUtil.copyProperties(oilDrawingPO, _oilDrawingVO);
			
			oilDrawingVOs.add(_oilDrawingVO);
		}
		
		return oilDrawingVOs;
	}

	@Override
	public List<OilDrawingVO> queryOilDrawingByOcsId(OilDrawingVO oilDrawingVO){
		
		List<OilDrawingPO> oilDrawingPOs = oilDrawingDao.queryOilDrawingByOcsId(oilDrawingVO.getOcsId());
		List<OilDrawingVO> oilDrawingVOs = new ArrayList<OilDrawingVO>();
		
		for(OilDrawingPO oilDrawingPO: oilDrawingPOs){
			OilDrawingVO _oilDrawingVO = new OilDrawingVO();
			BeanUtil.copyProperties(oilDrawingPO, _oilDrawingVO);
			oilDrawingVOs.add(_oilDrawingVO);
		}
		
		return oilDrawingVOs;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int saveOrUpdateOilDrawing(OilDrawingVO oilDrawingVO){
		
		OilDrawingPO oilDrawingPO = null;
		
		if(oilDrawingVO.getOdId() == null || oilDrawingVO.getOdId() == 0){
			oilDrawingPO = new OilDrawingPO();
		}else{
			oilDrawingPO = oilDrawingDao.get(oilDrawingVO.getOdId());
		}
		BeanUtil.copyProperties(oilDrawingVO, oilDrawingPO);
		
		oilDrawingDao.saveOrUpdate(oilDrawingPO);
		
		oilDrawingVO.setOdId(oilDrawingPO.getOdId());
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public List<OilDrawingVO> addOilDrawings(OilDrawingVO oilDrawingVO, List<String> drawingUrls) {
		
		List<OilDrawingVO> oilDrawingVOs = new ArrayList<OilDrawingVO>();
		
		for(String drawingUrl: drawingUrls){
			
			OilDrawingPO oilDrawingPO = new OilDrawingPO();
			
			BeanUtil.copyProperties(oilDrawingVO, oilDrawingPO);
			oilDrawingPO.setDrawingUrl(drawingUrl);
			
			oilDrawingDao.save(oilDrawingPO);
			
			OilDrawingVO _oilDrawingVO = new OilDrawingVO();
			
			BeanUtil.copyProperties(oilDrawingPO, _oilDrawingVO);
			
			oilDrawingVOs.add(_oilDrawingVO);
		}
		
		return oilDrawingVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteOilDrawingByOdId(OilDrawingVO oilDrawingVO){
		
		oilDrawingDao.deleteById(oilDrawingVO.getOdId());
	}

}
