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

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.dao.WaterwayCircuitPowerDrawingDao;
import com.fanglin.construction.po.WaterwayCircuitPowerDrawingPO;
import com.fanglin.construction.service.WaterwayCircuitPowerDrawingService;
import com.fanglin.construction.vo.WaterwayCircuitPowerDrawingVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;

@Service("waterwayCircuitPowerDrawingService")
@Transactional(readOnly=true)
public class WaterwayCircuitPowerDrawingServiceImpl implements WaterwayCircuitPowerDrawingService {
	
	@Autowired
	private WaterwayCircuitPowerDrawingDao waterwayCircuitPowerDrawingDao;
	
	@Autowired
	private UserDao userDao;

	@Override
	public WaterwayCircuitPowerDrawingVO queryWaterwayCircuitPowerDrawingById(int wcpdId){
		
		WaterwayCircuitPowerDrawingPO waterwayCircuitPowerDrawingPO = waterwayCircuitPowerDrawingDao.get(wcpdId);
		WaterwayCircuitPowerDrawingVO waterwayCircuitPowerDrawingVO = new WaterwayCircuitPowerDrawingVO();
		
		BeanUtil.copyProperties(waterwayCircuitPowerDrawingPO, waterwayCircuitPowerDrawingVO);
		
		return waterwayCircuitPowerDrawingVO;
	}

	@Override
	public List<WaterwayCircuitPowerDrawingVO> queryWaterwayCircuitPowerDrawingByCsId(WaterwayCircuitPowerDrawingVO waterwayCircuitPowerDrawingVO) {
		
		long csId = waterwayCircuitPowerDrawingVO.getCsId();
		List<WaterwayCircuitPowerDrawingPO> waterwayCircuitPowerDrawingPOs = waterwayCircuitPowerDrawingDao.queryWaterwayCircuitPowerDrawingByCsId(csId);
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
		
		int wcpcsId = waterwayCircuitPowerDrawingVO.getWcpcsId();
		List<WaterwayCircuitPowerDrawingPO> waterwayCircuitPowerDrawingPOs = waterwayCircuitPowerDrawingDao.queryWaterwayCircuitPowerDrawingByWcpcsId(wcpcsId);
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
	public int saveOrUpdateWaterwayCircuitPowerDrawing(WaterwayCircuitPowerDrawingVO waterwayCircuitPowerDrawingVO, String userId){
		
		WaterwayCircuitPowerDrawingPO waterwayCircuitPowerDrawingPO = null;
		
		if(waterwayCircuitPowerDrawingVO.getWcpdId() == null || waterwayCircuitPowerDrawingVO.getWcpdId() == 0){
			waterwayCircuitPowerDrawingPO = new WaterwayCircuitPowerDrawingPO();
		}else{
			waterwayCircuitPowerDrawingPO = waterwayCircuitPowerDrawingDao.get(waterwayCircuitPowerDrawingVO.getWcpdId());
		}
		
		BeanUtil.copyProperties(waterwayCircuitPowerDrawingVO, waterwayCircuitPowerDrawingPO);
		//新添加的创建人和创建时间
		UserPO userC = userDao.queryUserByUserId(userId);
		waterwayCircuitPowerDrawingPO.setCreater(userC);
		waterwayCircuitPowerDrawingPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		
		waterwayCircuitPowerDrawingDao.saveOrUpdate(waterwayCircuitPowerDrawingPO);
		
		waterwayCircuitPowerDrawingVO.setWcpdId(waterwayCircuitPowerDrawingPO.getWcpdId());
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public List<WaterwayCircuitPowerDrawingVO> addWaterwayCircuitPowerDrawings(WaterwayCircuitPowerDrawingVO waterwayCircuitPowerDrawingVO, List<String> drawingUrls, String userId) {
		
		List<WaterwayCircuitPowerDrawingVO> waterwayCircuitPowerDrawingVOs = new ArrayList<WaterwayCircuitPowerDrawingVO>();
		
		for(String drawingUrl: drawingUrls){
			
			WaterwayCircuitPowerDrawingPO waterwayCircuitPowerDrawingPO = new WaterwayCircuitPowerDrawingPO();
			
			BeanUtil.copyProperties(waterwayCircuitPowerDrawingVO, waterwayCircuitPowerDrawingPO);
			waterwayCircuitPowerDrawingPO.setDrawingUrl(drawingUrl);
			//新添加的创建人和创建时间
			UserPO userC = userDao.queryUserByUserId(userId);
			waterwayCircuitPowerDrawingPO.setCreater(userC);
			waterwayCircuitPowerDrawingPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
			
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
