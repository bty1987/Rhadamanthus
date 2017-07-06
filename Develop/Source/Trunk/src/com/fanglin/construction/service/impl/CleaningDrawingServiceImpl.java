/**
 * @File Name		: CleaningDrawingServiceImpl.java
 * @Package   	: com.fanglin.service.impl.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.dao.CleaningDrawingDao;
import com.fanglin.construction.po.CleaningDrawingPO;
import com.fanglin.construction.service.CleaningDrawingService;
import com.fanglin.construction.vo.CleaningDrawingVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;

@Service("cleaningDrawingService")
@Transactional(readOnly=true)
public class CleaningDrawingServiceImpl implements CleaningDrawingService {
	
	@Autowired
	private CleaningDrawingDao cleaningDrawingDao;
	
	@Autowired
	private UserDao userDao;

	@Override
	public CleaningDrawingVO queryCleaningDrawingById(int cdId){
		
		CleaningDrawingPO cleaningDrawingPO = cleaningDrawingDao.get(cdId);
		CleaningDrawingVO cleaningDrawingVO = new CleaningDrawingVO();
		
		BeanUtil.copyProperties(cleaningDrawingPO, cleaningDrawingVO);
		
		return cleaningDrawingVO;
	}

	@Override
	public List<CleaningDrawingVO> queryCleaningDrawingByCsId(CleaningDrawingVO cleaningDrawingVO) {
		
		long csId = cleaningDrawingVO.getCsId();
		List<CleaningDrawingPO> cleaningDrawingPOs = cleaningDrawingDao.queryCleaningDrawingByCsId(csId);
		List<CleaningDrawingVO> cleaningDrawingVOs = new ArrayList<CleaningDrawingVO>();
		
		for(CleaningDrawingPO cleaningDrawingPO: cleaningDrawingPOs){
			CleaningDrawingVO _cleaningDrawingVO = new CleaningDrawingVO();
			BeanUtil.copyProperties(cleaningDrawingPO, _cleaningDrawingVO);
			
			cleaningDrawingVOs.add(_cleaningDrawingVO);
		}
		
		return cleaningDrawingVOs;
	}

	@Override
	public List<CleaningDrawingVO> queryCleaningDrawingByCcsId(CleaningDrawingVO cleaningDrawingVO){
		
		int ccsId = cleaningDrawingVO.getCcsId();
		List<CleaningDrawingPO> cleaningDrawingPOs = cleaningDrawingDao.queryCleaningDrawingByCcsId(ccsId);
		List<CleaningDrawingVO> cleaningDrawingVOs = new ArrayList<CleaningDrawingVO>();
		
		for(CleaningDrawingPO cleaningDrawingPO: cleaningDrawingPOs){
			CleaningDrawingVO _cleaningDrawingVO = new CleaningDrawingVO();
			BeanUtil.copyProperties(cleaningDrawingPO, _cleaningDrawingVO);
			cleaningDrawingVOs.add(_cleaningDrawingVO);
		}
		
		return cleaningDrawingVOs;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int saveOrUpdateCleaningDrawing(CleaningDrawingVO cleaningDrawingVO, String userId){
		
		CleaningDrawingPO cleaningDrawingPO = null;
		
		if(cleaningDrawingVO.getCdId() == null || cleaningDrawingVO.getCdId() == 0){
			cleaningDrawingPO = new CleaningDrawingPO();
		}else{
			cleaningDrawingPO = cleaningDrawingDao.get(cleaningDrawingVO.getCdId());
		}
		
		BeanUtil.copyProperties(cleaningDrawingVO, cleaningDrawingPO);
		//新添加的创建人和创建时间
		UserPO userC = userDao.queryUserByUserId(userId);
		cleaningDrawingPO.setCreater(userC);
		cleaningDrawingPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		
		cleaningDrawingDao.saveOrUpdate(cleaningDrawingPO);
		
		cleaningDrawingVO.setCcsId(cleaningDrawingPO.getCcsId());

		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public List<CleaningDrawingVO> addCleaningDrawings(CleaningDrawingVO cleaningDrawingVO, List<String> drawingUrls, String userId) {
		
		List<CleaningDrawingVO> cleaningDrawingVOs = new ArrayList<CleaningDrawingVO>();
		
		for(String drawingUrl: drawingUrls){
			
			CleaningDrawingPO cleaningDrawingPO = new CleaningDrawingPO();
			
			BeanUtil.copyProperties(cleaningDrawingVO, cleaningDrawingPO);
			cleaningDrawingPO.setDrawingUrl(drawingUrl);
			//新添加的创建人和创建时间
			UserPO userC = userDao.queryUserByUserId(userId);
			cleaningDrawingPO.setCreater(userC);
			cleaningDrawingPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
			
			cleaningDrawingDao.save(cleaningDrawingPO);
			
			CleaningDrawingVO _cleaningDrawingVO = new CleaningDrawingVO();
			BeanUtil.copyProperties(cleaningDrawingPO, _cleaningDrawingVO);
			
			cleaningDrawingVOs.add(_cleaningDrawingVO);
		}
		
		return cleaningDrawingVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteCleaningDrawingByCdId(CleaningDrawingVO cleaningDrawingVO){
		
		cleaningDrawingDao.deleteById(cleaningDrawingVO.getCdId());
		
	}

}
