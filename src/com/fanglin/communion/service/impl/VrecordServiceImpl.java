package com.fanglin.communion.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.VrecordDao;
import com.fanglin.communion.po.VrecordPO;
import com.fanglin.communion.service.VrecordService;
import com.fanglin.communion.vo.VrecordVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("vrecordService")
@Transactional(readOnly=true)
public class VrecordServiceImpl implements VrecordService{
	
	@Autowired
	private VrecordDao vrecordDao;
	
	@Autowired
	private UserDao userDao;
	
	@Override
	public List<VrecordVO> queryVrecordByVid(VrecordVO vrecord) {
		
		List<VrecordPO> vrecordPOs = vrecordDao.queryVrecordByVid(vrecord.getVid());
		List<VrecordVO> vrecordVOs = new ArrayList<VrecordVO>();
		
		for(VrecordPO vrecordPO : vrecordPOs){
			
			VrecordVO vrecordVO = new VrecordVO(new UserBaseVO());
			
			BeanUtil.copyProperties(vrecordPO, vrecordVO, Arrays.asList("creater"));
			BeanUtil.copyProperties(vrecordPO.getCreater(), vrecordVO.getCreater(), Arrays.asList("dept","duty"));
			
			vrecordVOs.add(vrecordVO);
		}
		
		return vrecordVOs;
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addVrecord(VrecordVO vrecordVO, String userId) {
		
		UserPO creater = userDao.queryUserByUserId(userId);
		
		VrecordPO vrecordPO = new VrecordPO(creater);
		
		BeanUtil.copyProperties(vrecordVO, vrecordPO, Arrays.asList("creater"));
		vrecordPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		
		vrecordDao.save(vrecordPO);
		
	}
	
}
