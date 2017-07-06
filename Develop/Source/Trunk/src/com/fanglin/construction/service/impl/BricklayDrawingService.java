/**
 * @File Name		: BricklayDrawingService.java
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

import com.fanglin.construction.dao.BricklayDrawingDao;
import com.fanglin.construction.po.BricklayDrawingPO;
import com.fanglin.construction.vo.BricklayDrawingVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;

@Service("bricklayDrawingService")
@Transactional(readOnly=true)
public class BricklayDrawingService implements com.fanglin.construction.service.BricklayDrawingService {
	
	@Autowired
	private BricklayDrawingDao bricklayDrawingDao;
	
	@Autowired
	private UserDao userDao;

	@Override
	public BricklayDrawingVO queryBricklayDrawingById(int bdId){
		
		BricklayDrawingPO bricklayDrawingPO = bricklayDrawingDao.get(bdId);
		BricklayDrawingVO bricklayDrawingVO = new BricklayDrawingVO();
		
		BeanUtil.copyProperties(bricklayDrawingPO, bricklayDrawingVO);
		
		return bricklayDrawingVO;
	}
	
	@Override
	public List<BricklayDrawingVO> queryBricklayDrawingByCsId(BricklayDrawingVO bricklayDrawingVO) {
		
		long csId = bricklayDrawingVO.getCsId();
		List<BricklayDrawingPO> bricklayDrawingPOs = bricklayDrawingDao.queryBricklayDrawingByCsId(csId);
		List<BricklayDrawingVO> bricklayDrawingVOs = new ArrayList<BricklayDrawingVO>();
		
		for(BricklayDrawingPO bricklayDrawingPO: bricklayDrawingPOs){
			BricklayDrawingVO _bricklayDrawingVO = new BricklayDrawingVO();
			BeanUtil.copyProperties(bricklayDrawingPO, _bricklayDrawingVO);
			
			bricklayDrawingVOs.add(_bricklayDrawingVO);
		}
		
		return bricklayDrawingVOs;
	}

	@Override
	public List<BricklayDrawingVO> queryBricklayDrawingByBcsdId(BricklayDrawingVO bricklayDrawingVO){
		
		int bcsId = bricklayDrawingVO.getBcsId();
		List<BricklayDrawingPO> bricklayDrawingPOs = bricklayDrawingDao.queryBricklayDrawingByBcsId(bcsId);
		List<BricklayDrawingVO> bricklayDrawingVOs = new ArrayList<BricklayDrawingVO>();
		
		for(BricklayDrawingPO bricklayDrawingPO: bricklayDrawingPOs){
			BricklayDrawingVO _bricklayDrawingVO = new BricklayDrawingVO();
			BeanUtil.copyProperties(bricklayDrawingPO, _bricklayDrawingVO);
			
			bricklayDrawingVOs.add(_bricklayDrawingVO);
		}
		
		return bricklayDrawingVOs;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int saveOrUpdateBricklayDrawing(BricklayDrawingVO bricklayDrawingVO, String  userId){
		
		BricklayDrawingPO bricklayDrawingPO = null;
		
		if(bricklayDrawingVO.getBdId() == null || bricklayDrawingVO.getBdId() == 0){
			bricklayDrawingPO = new BricklayDrawingPO();
		}else{
			bricklayDrawingPO = bricklayDrawingDao.get(bricklayDrawingVO.getBdId());
		}
		
		BeanUtil.copyProperties(bricklayDrawingVO, bricklayDrawingPO);
		//新添加的创建人和创建时间
		UserPO userC = userDao.queryUserByUserId(userId);
		bricklayDrawingPO.setCreater(userC);
		bricklayDrawingPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		
		bricklayDrawingDao.saveOrUpdate(bricklayDrawingPO);
		
		bricklayDrawingVO.setBdId(bricklayDrawingPO.getBdId());
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public List<BricklayDrawingVO> addbrBricklayDrawings(BricklayDrawingVO bricklayDrawingVO, List<String> drawingUrls, String userId) {
		
		List<BricklayDrawingVO> bricklayDrawingVOs = new ArrayList<BricklayDrawingVO>();
		
		for(String drawingUrl: drawingUrls){
			
			BricklayDrawingPO bricklayDrawingPO = new BricklayDrawingPO();
			
			BeanUtil.copyProperties(bricklayDrawingVO, bricklayDrawingPO);
			bricklayDrawingPO.setDrawingUrl(drawingUrl);
			//新添加的创建人和创建时间
			UserPO userC = userDao.queryUserByUserId(userId);
			bricklayDrawingPO.setCreater(userC);
			bricklayDrawingPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
			
			bricklayDrawingDao.save(bricklayDrawingPO);
			
			BricklayDrawingVO _bricklayDrawingVO = new BricklayDrawingVO();
			BeanUtil.copyProperties(bricklayDrawingPO, _bricklayDrawingVO);
			
			bricklayDrawingVOs.add(_bricklayDrawingVO);
		}
		
		return bricklayDrawingVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteBrickLayDrawingByBdId(BricklayDrawingVO bricklayDrawingVO){
		
		bricklayDrawingDao.deleteById(bricklayDrawingVO.getBdId());
	}

}
