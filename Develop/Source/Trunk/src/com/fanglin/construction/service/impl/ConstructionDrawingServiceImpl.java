package com.fanglin.construction.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.dao.ConstructionDrawingDao;
import com.fanglin.construction.po.ConstructionDrawingPO;
import com.fanglin.construction.service.ConstructionDrawingService;
import com.fanglin.construction.vo.ConstructionDrawingVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;

@Service("constructionDrawingService")
@Transactional(readOnly=true)
public class ConstructionDrawingServiceImpl implements ConstructionDrawingService {

	@Autowired
	private ConstructionDrawingDao constructionDrawingDao;
	
	@Autowired
	private UserDao userDao;
	
	@Override
	public List<ConstructionDrawingVO> queryConstructionDrawing(ConstructionDrawingVO constructionDrawingVO) {
		
		Long cid = constructionDrawingVO.getCid();
		Short schedule = constructionDrawingVO.getSchedule();
		List<ConstructionDrawingPO> constructionDrawingPOs = constructionDrawingDao.queryConstructionDrawing(cid, schedule);
		List<ConstructionDrawingVO> constructionDrawingVOs = new ArrayList<ConstructionDrawingVO>(); 
		
		for(ConstructionDrawingPO constructionDrawingPO: constructionDrawingPOs){
			
			ConstructionDrawingVO _constructionDrawingVO = new ConstructionDrawingVO();
			
			BeanUtil.copyProperties(constructionDrawingPO, _constructionDrawingVO, Arrays.asList("creater"));
			
			constructionDrawingVOs.add(_constructionDrawingVO);
		}
		
		return constructionDrawingVOs;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addConstructionDrawing(ConstructionDrawingVO constructionDrawingVO, String userId) {

		ConstructionDrawingPO constructionDrawingPO = null;
		
		if(constructionDrawingVO.getCdId() == null ||  constructionDrawingVO.getCdId() == 0){
			constructionDrawingPO = new ConstructionDrawingPO();
		}else{
			constructionDrawingPO = constructionDrawingDao.get(constructionDrawingVO.getCdId());
		}
		
		BeanUtil.copyProperties(constructionDrawingVO, constructionDrawingPO, Arrays.asList("creater"));
		//新添加的创建人和创建时间
		UserPO userC = userDao.queryUserByUserId(userId);
		constructionDrawingPO.setCreater(userC);
		constructionDrawingPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		
		constructionDrawingDao.saveOrUpdate(constructionDrawingPO);
		
		constructionDrawingVO.setCdId(constructionDrawingPO.getCdId());
		
		return 0;

	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public List<ConstructionDrawingVO> addConstructionDrawings(ConstructionDrawingVO constructionDrawingVO, List<String> drawingUrls, String userId) {

		List<ConstructionDrawingVO> constructionDrawingVOs = new ArrayList<ConstructionDrawingVO>();
		
		for(String drawingUrl: drawingUrls){
			
			ConstructionDrawingPO constructionDrawingPO = new ConstructionDrawingPO();
			
			BeanUtil.copyProperties(constructionDrawingVO, constructionDrawingPO, Arrays.asList("creater"));
			constructionDrawingPO.setDrawingUrl(drawingUrl);
			//新添加的创建人和创建时间
			UserPO userC = userDao.queryUserByUserId(userId);
			constructionDrawingPO.setCreater(userC);
			constructionDrawingPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
			
			constructionDrawingDao.save(constructionDrawingPO);
			
			ConstructionDrawingVO _constructionDrawingVO = new ConstructionDrawingVO();
			BeanUtil.copyProperties(constructionDrawingPO, _constructionDrawingVO, Arrays.asList("creater"));
			
			constructionDrawingVOs.add(_constructionDrawingVO);
		}
		
		return constructionDrawingVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteConstructionDrawingByCdId(ConstructionDrawingVO constructionDrawingVO) {
		
		constructionDrawingDao.deleteById(constructionDrawingVO.getCdId());

	}

}
