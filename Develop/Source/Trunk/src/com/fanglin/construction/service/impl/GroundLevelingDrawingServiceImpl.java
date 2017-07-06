/**
 * @File Name		: GroundLevelingDrawingServiceImpl.java
 * @Package   	: com.fanglin.service.constructionSchedule.impl
 * @Version		: 1.0
 * @Date			: 2015-4-9
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

import com.fanglin.construction.dao.GroundLevelingDrawingDao;
import com.fanglin.construction.po.GroundLevelingDrawingPO;
import com.fanglin.construction.service.GroundLevelingDrawingService;
import com.fanglin.construction.vo.GroundLevelingDrawingVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;

@Service("groundLevelingDrawingService")
@Transactional(readOnly=true)
public class GroundLevelingDrawingServiceImpl implements GroundLevelingDrawingService {
	
	@Autowired
	private GroundLevelingDrawingDao groundLevelingDrawingDao;
	
	@Autowired
	private UserDao userDao;

	@Override
	public GroundLevelingDrawingVO queryGroundLevelingDrawingById(int gldId){
		
		GroundLevelingDrawingPO groundLevelingDrawingPO = groundLevelingDrawingDao.get(gldId);
		GroundLevelingDrawingVO groundLevelingDrawingVO = new GroundLevelingDrawingVO();
		
		BeanUtil.copyProperties(groundLevelingDrawingPO, groundLevelingDrawingVO);
		
		return groundLevelingDrawingVO;
	}

	@Override
	public List<GroundLevelingDrawingVO> queryGroundLevelingDrawingByCsId(GroundLevelingDrawingVO groundLevelingDrawingVO) {
		
		long csId = groundLevelingDrawingVO.getCsId();
		List<GroundLevelingDrawingPO> groundLevelingDrawingPOs = groundLevelingDrawingDao.queryGroundLevelingDrawingByCsId(csId);
		List<GroundLevelingDrawingVO> groundLevelingDrawingVOs = new ArrayList<GroundLevelingDrawingVO>();
		
		for(GroundLevelingDrawingPO groundLevelingDrawingPO: groundLevelingDrawingPOs){
			GroundLevelingDrawingVO _groundLevelingDrawingVO = new GroundLevelingDrawingVO();
			BeanUtil.copyProperties(groundLevelingDrawingPO, _groundLevelingDrawingVO);
			
			groundLevelingDrawingVOs.add(_groundLevelingDrawingVO);
		}
		
		return groundLevelingDrawingVOs;
	}

	@Override
	public List<GroundLevelingDrawingVO> queryGroundLevelingDrawingByGlcsId(GroundLevelingDrawingVO groundLevelingDrawingVO){
		
		int glcsId = groundLevelingDrawingVO.getGlcsId();
		List<GroundLevelingDrawingPO> groundLevelingDrawingPOs = groundLevelingDrawingDao.queryGroundLevelingDrawingByGlcsId(glcsId);
		List<GroundLevelingDrawingVO> groundLevelingDrawingVOs = new ArrayList<GroundLevelingDrawingVO>();
		
		for(GroundLevelingDrawingPO groundLevelingDrawingPO: groundLevelingDrawingPOs){
			GroundLevelingDrawingVO _groundLevelingDrawingVO = new GroundLevelingDrawingVO();
			BeanUtil.copyProperties(groundLevelingDrawingPO, _groundLevelingDrawingVO);
			groundLevelingDrawingVOs.add(_groundLevelingDrawingVO);
		}
		
		return groundLevelingDrawingVOs;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int saveOrUpdateGroundLevelingDrawing(GroundLevelingDrawingVO groundLevelingDrawingVO, String userId){
		GroundLevelingDrawingPO groundLevelingDrawingPO = null;
		
		if(groundLevelingDrawingVO.getGldId() == null || groundLevelingDrawingVO.getGldId() == 0){
			groundLevelingDrawingPO = new GroundLevelingDrawingPO();
		}else{
			groundLevelingDrawingPO = groundLevelingDrawingDao.get(groundLevelingDrawingVO.getGldId());
		}
		BeanUtil.copyProperties(groundLevelingDrawingVO, groundLevelingDrawingPO);
		//新添加的创建人和创建时间
		UserPO userC = userDao.queryUserByUserId(userId);
		groundLevelingDrawingPO.setCreater(userC);
		groundLevelingDrawingPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		
		groundLevelingDrawingDao.saveOrUpdate(groundLevelingDrawingPO);
		
		Integer gldId = groundLevelingDrawingPO.getGldId();
		groundLevelingDrawingVO.setGldId(gldId);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public List<GroundLevelingDrawingVO> addGroundLevelingDrawings(GroundLevelingDrawingVO groundLevelingDrawingVO, List<String> drawingUrls, String userId) {
		
		List<GroundLevelingDrawingVO> groundLevelingDrawingVOs = new ArrayList<GroundLevelingDrawingVO>();
		
		for(String drawingUrl: drawingUrls){
			
			GroundLevelingDrawingPO groundLevelingDrawingPO = new GroundLevelingDrawingPO();
			
			BeanUtil.copyProperties(groundLevelingDrawingVO, groundLevelingDrawingPO);
			groundLevelingDrawingPO.setDrawingUrl(drawingUrl);
			//新添加的创建人和创建时间
			UserPO userC = userDao.queryUserByUserId(userId);
			groundLevelingDrawingPO.setCreater(userC);
			groundLevelingDrawingPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
			
			groundLevelingDrawingDao.save(groundLevelingDrawingPO);
			
			GroundLevelingDrawingVO _groundLevelingDrawingVO = new GroundLevelingDrawingVO();
			BeanUtil.copyProperties(groundLevelingDrawingPO, _groundLevelingDrawingVO);
			
			groundLevelingDrawingVOs.add(_groundLevelingDrawingVO);
		}
		
		return groundLevelingDrawingVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteGroundLevelingDrawingByGldId(GroundLevelingDrawingVO groundLevelingDrawingVO){
		
		groundLevelingDrawingDao.deleteById(groundLevelingDrawingVO.getGldId());
	}

}
