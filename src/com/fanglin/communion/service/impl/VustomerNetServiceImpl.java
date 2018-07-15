package com.fanglin.communion.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.VustomerNetDao;
import com.fanglin.communion.po.VustomerNetPO;
import com.fanglin.communion.service.VustomerNetService;
import com.fanglin.communion.vo.VustomerNetVO;
import com.fanglin.utils.BeanUtil;

@Service("vustomerNetService")
@Transactional(readOnly = true)
public class VustomerNetServiceImpl implements VustomerNetService {

	@Autowired
	private VustomerNetDao vustomerNetDao;

	@Override
	public List<?> countVustomerNetByUnionId(VustomerNetVO vustomerNetVO) {

		List<?> count = vustomerNetDao.countByUnionId(vustomerNetVO.getUnionId());

		return count;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int buildVustomerNet(VustomerNetVO vustomerNetVO){

		if (vustomerNetVO.getUnionId() != null && vustomerNetVO.getNetunionId() != null) {

			VustomerNetPO unionId = vustomerNetDao.queryVustomerNet(vustomerNetVO.getUnionId(),vustomerNetVO.getNetunionId());
			VustomerNetPO netUnionId = vustomerNetDao.queryVustomerNet(vustomerNetVO.getNetunionId(), vustomerNetVO.getUnionId());

			if(unionId == null && netUnionId == null){
				
				VustomerNetPO vustomerNetPO = new VustomerNetPO();
				
				BeanUtil.copyProperties(vustomerNetVO, vustomerNetPO);
				
				vustomerNetDao.save(vustomerNetPO);
			}
			
		}

		return 0;

	}

}
