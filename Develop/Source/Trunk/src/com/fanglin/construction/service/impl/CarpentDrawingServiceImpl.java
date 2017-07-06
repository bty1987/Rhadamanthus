/**
 * @File Name		: CarpentDrawingServiceImpl.java
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

import com.fanglin.construction.dao.CarpentDrawingDao;
import com.fanglin.construction.po.CarpentDrawingPO;
import com.fanglin.construction.service.CarpentDrawingService;
import com.fanglin.construction.vo.CarpentDrawingVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;

@Service("carpentDrawingService")
@Transactional(readOnly=true)
public class CarpentDrawingServiceImpl implements CarpentDrawingService {
	
	@Autowired
	private CarpentDrawingDao carpentDrawingDao;
	
	@Autowired
	private UserDao userDao;

	@Override
	public CarpentDrawingVO queryCarpentDrawingById(int cdId){
		
		CarpentDrawingPO carpentDrawingPO = carpentDrawingDao.get(cdId);
		CarpentDrawingVO carpentDrawingVO = new CarpentDrawingVO();
		
		BeanUtil.copyProperties(carpentDrawingPO, carpentDrawingVO);
		
		return carpentDrawingVO;
	}
	
	@Override
	public List<CarpentDrawingVO> queryCarpentDrawingByCsId(CarpentDrawingVO carpentDrawingVO) {
		
		long csId = carpentDrawingVO.getCsId();
		List<CarpentDrawingPO> carpentDrawingPOs = carpentDrawingDao.queryCarpentDrawingByCsId(csId);
		List<CarpentDrawingVO> carpentDrawingVOs = new ArrayList<CarpentDrawingVO>();
		
		for(CarpentDrawingPO carpentDrawingPO: carpentDrawingPOs){
			CarpentDrawingVO _carpentDrawingVO = new CarpentDrawingVO();
			BeanUtil.copyProperties(carpentDrawingPO, _carpentDrawingVO);
			
			carpentDrawingVOs.add(_carpentDrawingVO);
		}
		
		return carpentDrawingVOs;
	}

	@Override
	public List<CarpentDrawingVO> queryCarpentDrawingByCcsId(CarpentDrawingVO carpentDrawingVO){

		int ccsId = carpentDrawingVO.getCcsId();
		List<CarpentDrawingPO> carpentDrawingPOs = carpentDrawingDao.queryCarpentDrawingByCcsId(ccsId);
		List<CarpentDrawingVO> carpentDrawingVOs = new ArrayList<CarpentDrawingVO>();
		
		for(CarpentDrawingPO carpentDrawingPO: carpentDrawingPOs){
			CarpentDrawingVO _carpentDrawingVO = new CarpentDrawingVO();
			BeanUtil.copyProperties(carpentDrawingPO, _carpentDrawingVO);
			carpentDrawingVOs.add(_carpentDrawingVO);
		}
		
		return carpentDrawingVOs;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int saveOrUpdateCarpentDrawing(CarpentDrawingVO carpentDrawingVO, String userId){
		
		CarpentDrawingPO carpentDrawingPO = null;
		
		if(carpentDrawingVO.getCdId() == null || carpentDrawingVO.getCdId() == 0){
			carpentDrawingPO = new CarpentDrawingPO();
		}else {
			carpentDrawingPO = carpentDrawingDao.get(carpentDrawingVO.getCdId());
		}
		
		BeanUtil.copyProperties(carpentDrawingVO, carpentDrawingPO);
		//新添加的创建人和创建时间
		UserPO userC = userDao.queryUserByUserId(userId);
		carpentDrawingPO.setCreater(userC);
		carpentDrawingPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		
		carpentDrawingDao.saveOrUpdate(carpentDrawingPO);
		
		carpentDrawingVO.setCdId(carpentDrawingPO.getCdId());
		
		return carpentDrawingPO.getCdId();
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public List<CarpentDrawingVO> addCarpentDrawings(CarpentDrawingVO carpentDrawingVO, List<String> drawingUrls, String userId) {
		
		List<CarpentDrawingVO> carpentDrawingVOs = new ArrayList<CarpentDrawingVO>();
		
		for(String drawingUrl: drawingUrls){
			
			CarpentDrawingPO carpentDrawingPO = new CarpentDrawingPO();
			
			BeanUtil.copyProperties(carpentDrawingVO, carpentDrawingPO);
			carpentDrawingPO.setDrawingUrl(drawingUrl);
			//新添加的创建人和创建时间
			UserPO userC = userDao.queryUserByUserId(userId);
			carpentDrawingPO.setCreater(userC);
			carpentDrawingPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
			
			carpentDrawingDao.save(carpentDrawingPO);
			
			CarpentDrawingVO _carpentDrawingVO = new CarpentDrawingVO();
			BeanUtil.copyProperties(carpentDrawingPO, _carpentDrawingVO);
			
			carpentDrawingVOs.add(_carpentDrawingVO);
		}
		
		return carpentDrawingVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteCarpentDrawingByCdId(CarpentDrawingVO carpentDrawingVO){
		
		carpentDrawingDao.deleteById(carpentDrawingVO.getCdId());
	}

}
