package com.fanglin.information.service.impl;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.information.dao.VreceiptDao;
import com.fanglin.information.po.VreceiptPO;
import com.fanglin.information.service.VreceiptService;
import com.fanglin.information.vo.VreceiptVO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;

@Service("vreceiptService")
@Transactional(readOnly=true)
public class VreceiptServiceImpl implements VreceiptService {
	
	@Autowired
	private VreceiptDao vreceiptDao;

	@Override
	public VreceiptVO queryVreceiptByVrid(VreceiptVO vreceiptVO) {
		
		VreceiptPO vreceiptPO = vreceiptDao.get(vreceiptVO.getVrid());
		
		vreceiptVO = new VreceiptVO(new UserBaseVO());
		
		BeanUtil.copyProperties(vreceiptPO, vreceiptVO, Arrays.asList("collecter"));
		BeanUtil.copyProperties(vreceiptPO.getCollecter(), vreceiptVO.getCollecter(), Arrays.asList("dept","duty"));
		
		return vreceiptVO;
	}

}
