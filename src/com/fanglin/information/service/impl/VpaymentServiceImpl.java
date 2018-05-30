package com.fanglin.information.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.information.dao.VpaymentDao;
import com.fanglin.information.po.VpaymentPO;
import com.fanglin.information.service.VpaymentService;
import com.fanglin.information.vo.VpaymentVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("vpaymentService")
@Transactional(readOnly=true)
public class VpaymentServiceImpl implements VpaymentService{
	
	@Autowired
	private VpaymentDao vpaymentDao;
	
	@Autowired
	private UserDao userDao;

	@Override
	public void pageVpayment(Paging paging, List<Filter> filters) {
		
		List<VpaymentPO> vpaymentPOs = vpaymentDao.pageVpayment(paging, filters);
		List<VpaymentVO> vpaymentVOs = new ArrayList<VpaymentVO>();
		
		VpaymentVO vpaymentVO;
		
		for (VpaymentPO vpaymentPO : vpaymentPOs) {
			
			vpaymentVO = new VpaymentVO(new UserBaseVO(), new UserBaseVO());
			
			BeanUtil.copyProperties(vpaymentPO, vpaymentVO, Arrays.asList("creater", "collecter"));
			BeanUtil.copyProperties(vpaymentPO.getCreater(), vpaymentVO.getCreater(), Arrays.asList("duty", "dept"));
			BeanUtil.copyProperties(vpaymentPO.getCollecter(), vpaymentVO.getCollecter(), Arrays.asList("duty", "dept"));
			
			vpaymentVOs.add(vpaymentVO);
		}
		
		paging.setData(vpaymentVOs);
	}
	
	@Override
	public List<?> countVpayment() {
		
		List<?> countList = vpaymentDao.countVpayment();
		
		return countList;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int createVpayment(VpaymentVO vpaymentVO, String userId) {
		
		VpaymentPO vpaymentPO = new VpaymentPO();
		
		UserPO createrPO = userDao.queryUserByUserId(userId);
		
		if(vpaymentVO.getCollecter() != null){
			UserPO collecterPO = userDao.queryUserByUserId(vpaymentVO.getCollecter().getUserId());
			vpaymentPO.setCollecter(collecterPO);
		}
		
		BeanUtil.copyProperties(vpaymentVO, vpaymentPO, Arrays.asList("creater", "collecter"));
		vpaymentPO.setCreater(createrPO);
		vpaymentPO.setCreateTime(new Timestamp(System.currentTimeMillis()));//DateUtil.getDateToTimestamp(new Date())
		vpaymentPO.setCollectTime(new Timestamp(System.currentTimeMillis()));
		
		vpaymentDao.save(vpaymentPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteVpaymentId(VpaymentVO vpaymentVO) {
		VpaymentPO vpaymentPO=vpaymentDao.get(vpaymentVO.getVpid());
		
		
		vpaymentDao.delete(vpaymentPO);
		
		return 0;
	}

	

	
}
