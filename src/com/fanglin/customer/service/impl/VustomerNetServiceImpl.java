package com.fanglin.customer.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.customer.dao.VustomerNetDao;
import com.fanglin.customer.po.VustomerNetPO;
import com.fanglin.customer.service.VustomerNetService;
import com.fanglin.customer.vo.VustomerNetVO;
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
	public int buildVustomerNet(VustomerNetVO vustomerNetVO) {

		if (vustomerNetVO.getUnionId() != null && vustomerNetVO.getNetunionId() != null && !vustomerNetVO.getUnionId().equals(vustomerNetVO.getNetunionId())) {

			VustomerNetPO unionId = vustomerNetDao.queryVustomerNet(vustomerNetVO.getUnionId(), vustomerNetVO.getNetunionId());
			VustomerNetPO netUnionId = vustomerNetDao.queryVustomerNet(vustomerNetVO.getNetunionId(), vustomerNetVO.getUnionId());

			if (unionId == null && netUnionId == null) {

				VustomerNetPO vustomerNetPO = new VustomerNetPO();

				BeanUtil.copyProperties(vustomerNetVO, vustomerNetPO);

				vustomerNetDao.save(vustomerNetPO);
			}
		}

		return 0;
	}

}
