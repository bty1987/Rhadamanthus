/**
 * @File Name		: PutlineDrawingServiceImpl.java
 * @Package   	: com.fanglin.service.impl.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-10-2
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

import com.fanglin.construction.dao.PutlineDrawingDao;
import com.fanglin.construction.po.PutlineDrawingPO;
import com.fanglin.construction.service.PutlineDrawingService;
import com.fanglin.construction.vo.PutlineDrawingVO;
import com.fanglin.utils.BeanUtil;

@Service("putlineDrawingService")
@Transactional(readOnly=true)
public class PutlineDrawingServiceImpl implements PutlineDrawingService {
	
	@Autowired
	private PutlineDrawingDao putlineDrawingDao;

	@Override
	public PutlineDrawingVO queryPutlineDrawingById(int pldId){
		
		PutlineDrawingPO putlineDrawingPO = putlineDrawingDao.get(pldId);
		PutlineDrawingVO putlineDrawingVO = new PutlineDrawingVO();
		
		BeanUtil.copyProperties(putlineDrawingPO, putlineDrawingVO);
		
		return putlineDrawingVO;
	}

	@Override
	public List<PutlineDrawingVO> queryPutlineDrawingByCsId(PutlineDrawingVO putlineDrawingVO) {
		
		long csId = putlineDrawingVO.getCsId();
		List<PutlineDrawingPO> putlineDrawingPOs = putlineDrawingDao.queryPutlineDrawingByCsId(csId);
		List<PutlineDrawingVO> putlineDrawingVOs = new ArrayList<PutlineDrawingVO>();
		
		for(PutlineDrawingPO putlineDrawingPO: putlineDrawingPOs){
			PutlineDrawingVO _putlineDrawingVO = new PutlineDrawingVO();
			BeanUtil.copyProperties(putlineDrawingPO, _putlineDrawingVO);
			
			putlineDrawingVOs.add(_putlineDrawingVO);
		}
		
		return putlineDrawingVOs;
	}

	@Override
	public List<PutlineDrawingVO> queryPutlineDrawingByPlcsId(PutlineDrawingVO putlineDrawingVO){
		
		if(putlineDrawingVO == null){
			return null;
		}
		
		int plcsId = putlineDrawingVO.getPlcsId();
		List<PutlineDrawingPO> putlineDrawingPOs = putlineDrawingDao.queryPutlineDrawingByPlcsId(plcsId);
		List<PutlineDrawingVO> putlineDrawingVOs = new ArrayList<PutlineDrawingVO>();
		
		for(PutlineDrawingPO putlineDrawingPO: putlineDrawingPOs){
			PutlineDrawingVO _putlineDrawingVO = new PutlineDrawingVO();
			BeanUtil.copyProperties(putlineDrawingPO, _putlineDrawingVO);
			putlineDrawingVOs.add(_putlineDrawingVO);
		}
		
		return putlineDrawingVOs;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int saveOrUpdatePutlineDrawing(PutlineDrawingVO putlineDrawingVO){
		
		PutlineDrawingPO putlineDrawingPO = null;
		
		if(putlineDrawingVO.getPldId() == null || putlineDrawingVO.getPldId() == 0){
			putlineDrawingPO = new PutlineDrawingPO();
		}else{
			putlineDrawingPO = putlineDrawingDao.get(putlineDrawingVO.getPldId());
		}
		
		BeanUtil.copyProperties(putlineDrawingVO, putlineDrawingPO);
		
		putlineDrawingDao.saveOrUpdate(putlineDrawingPO);
		
		putlineDrawingVO.setPldId(putlineDrawingPO.getPldId());
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public List<PutlineDrawingVO> addPutlineDrawings(PutlineDrawingVO putlineDrawingVO, List<String> drawingUrls) {
		
		List<PutlineDrawingVO> putlineDrawingVOs = new ArrayList<PutlineDrawingVO>();
		
		for(String drawingUrl: drawingUrls){
			
			PutlineDrawingPO putlineDrawingPO = new PutlineDrawingPO();
			
			BeanUtil.copyProperties(putlineDrawingVO, putlineDrawingPO);
			putlineDrawingPO.setDrawingUrl(drawingUrl);
			
			putlineDrawingDao.save(putlineDrawingPO);
			
			PutlineDrawingVO _putlineDrawingVO = new PutlineDrawingVO();
			BeanUtil.copyProperties(putlineDrawingPO, _putlineDrawingVO);
			
			putlineDrawingVOs.add(_putlineDrawingVO);
		}
		
		return putlineDrawingVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deletePutlineDrawingByPldId(PutlineDrawingVO putlineDrawingVO){
		putlineDrawingDao.deleteById(putlineDrawingVO.getPldId());
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deletePutlineDrawingByPlcsId(int plcsId){
		
		List<PutlineDrawingPO> putlineDrawingPOs = putlineDrawingDao.queryPutlineDrawingByPlcsId(plcsId);
		for(PutlineDrawingPO putlineDrawingPO: putlineDrawingPOs){
			putlineDrawingDao.delete(putlineDrawingPO);
		}

	}

}
