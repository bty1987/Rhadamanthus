/**
 * @File Name		: ChanDrawingServiceImpl.java
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

import com.fanglin.construction.dao.ChanDrawingDao;
import com.fanglin.construction.po.ChanDrawingPO;
import com.fanglin.construction.service.ChanDrawingService;
import com.fanglin.construction.vo.ChanDrawingVO;
import com.fanglin.utils.BeanUtil;

@Service("chanDrawingService")
@Transactional(readOnly=true)
public class ChanDrawingServiceImpl implements ChanDrawingService {
	
	@Autowired
	private ChanDrawingDao chanDrawingDao;

	@Override
	public ChanDrawingVO queryChanDrawingById(int cdId){
		
		ChanDrawingPO chanDrawingPO = chanDrawingDao.get(cdId);
		ChanDrawingVO chanDrawingVO = new ChanDrawingVO();
		
		BeanUtil.copyProperties(chanDrawingPO, chanDrawingVO);
		
		return chanDrawingVO;
	}

	@Override
	public List<ChanDrawingVO> queryChanDrawingByCsId(ChanDrawingVO chanDrawingVO) {
		
		long csId = chanDrawingVO.getCsId();
		List<ChanDrawingPO> chanDrawingPOs = chanDrawingDao.queryChanDrawingByCsId(csId);
		List<ChanDrawingVO> chanDrawingVOs = new ArrayList<ChanDrawingVO>();
		
		for(ChanDrawingPO chanDrawingPO: chanDrawingPOs){
			ChanDrawingVO _chanDrawingVO = new ChanDrawingVO();
			BeanUtil.copyProperties(chanDrawingPO, _chanDrawingVO);
			
			chanDrawingVOs.add(_chanDrawingVO);
		}
		
		return chanDrawingVOs;
	}

	@Override
	public List<ChanDrawingVO> queryChanDrawingByCcsId(ChanDrawingVO chanDrawingVO){
		
		int ccsId = chanDrawingVO.getCcsId();
		List<ChanDrawingPO> chanDrawingPOs = chanDrawingDao.queryChanDrawingByCcsId(ccsId);
		List<ChanDrawingVO> chanDrawingVOs = new ArrayList<ChanDrawingVO>(); 
		
		for(ChanDrawingPO chanDrawingPO: chanDrawingPOs){
			ChanDrawingVO _chanDrawingVO = new ChanDrawingVO();
			
			BeanUtil.copyProperties(chanDrawingPO, _chanDrawingVO);
			
			chanDrawingVOs.add(_chanDrawingVO);
		}
		
		return chanDrawingVOs;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int saveOrUpdateChanDrawing(ChanDrawingVO chanDrawingVO){
		
		ChanDrawingPO chanDrawingPO = null;
		
		if(chanDrawingVO.getCdId() == null ||  chanDrawingVO.getCdId() == 0){
			chanDrawingPO = new ChanDrawingPO();
		}else{
			chanDrawingPO = chanDrawingDao.get(chanDrawingVO.getCdId());
		}
		
		BeanUtil.copyProperties(chanDrawingVO, chanDrawingPO);
		
		chanDrawingDao.saveOrUpdate(chanDrawingPO);
		
		chanDrawingVO.setCdId(chanDrawingPO.getCdId());
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public List<ChanDrawingVO> addChanDrawings(ChanDrawingVO chanDrawingVO, List<String> drawingUrls) {
		
		List<ChanDrawingVO> chanDrawingVOs = new ArrayList<ChanDrawingVO>();
		
		for(String drawingUrl: drawingUrls){
			
			ChanDrawingPO chanDrawingPO = new ChanDrawingPO();
			
			BeanUtil.copyProperties(chanDrawingVO, chanDrawingPO);
			chanDrawingPO.setDrawingUrl(drawingUrl);
			
			chanDrawingDao.save(chanDrawingPO);
			
			ChanDrawingVO _chanDrawingVO = new ChanDrawingVO();
			BeanUtil.copyProperties(chanDrawingPO, _chanDrawingVO);
			
			chanDrawingVOs.add(_chanDrawingVO);
		}
		
		return chanDrawingVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteChanDrawingByCdId(ChanDrawingVO chanDrawingVO){
		
		chanDrawingDao.deleteById(chanDrawingVO.getCdId());
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteChanDrawingByCssId(int ccsId){
		
		List<ChanDrawingPO> chanDrawingPOs = chanDrawingDao.queryChanDrawingByCcsId(ccsId);
		for(ChanDrawingPO chanDrawingPO: chanDrawingPOs){
			chanDrawingDao.delete(chanDrawingPO);
		}
	}

}
