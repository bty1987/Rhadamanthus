/**
 * @File Name		: VactivityServiceImpl.java
 * @Package   	: com.fanglin.information.service.impl
 * @Version		: 1.0
 * @Date			: 2019-4-28
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.information.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.dao.VactivityDao;
import com.fanglin.information.dao.VpaymentDao;
import com.fanglin.information.dao.VprizeDao;
import com.fanglin.information.dao.VticketDao;
import com.fanglin.information.po.VactivityPO;
import com.fanglin.information.po.VpaymentPO;
import com.fanglin.information.po.VprizePO;
import com.fanglin.information.po.VticketPO;
import com.fanglin.information.service.VactivityService;
import com.fanglin.information.vo.VactivityVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("vactivityService")
@Transactional(readOnly = true)
public class VactivityServiceImpl implements VactivityService {

	@Autowired
	private VactivityDao vactivityDao;

	@Autowired
	private VprizeDao vprizeDao;

	@Autowired
	private VpaymentDao vpaymentDao;

	@Autowired
	private VticketDao vticketDao;

	@Override
	public void pageVactivity(Paging paging, List<Filter> filters) {

		List<VactivityPO> vactivityPOs = vactivityDao.pageVactivity(paging, filters);
		List<VactivityVO> vactivityVOs = new ArrayList<VactivityVO>();

		VactivityVO vactivityVO;

		for (VactivityPO vactivityPO : vactivityPOs) {

			vactivityVO = new VactivityVO();

			BeanUtil.copyPropertie(vactivityPO, vactivityVO);

			vactivityVOs.add(vactivityVO);
		}

		paging.setData(vactivityVOs);
	}

	@Override
	public List<VactivityVO> queryVactivity() {

		List<VactivityPO> vactivityPOs = vactivityDao.queryVactivity();
		List<VactivityVO> vactivityVOs = new ArrayList<VactivityVO>();

		VactivityVO vactivityVO;

		for (VactivityPO vactivityPO : vactivityPOs) {

			vactivityVO = new VactivityVO();

			BeanUtil.copyPropertie(vactivityPO, vactivityVO);

			vactivityVOs.add(vactivityVO);
		}

		return vactivityVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateVactivityForStatus(VactivityVO vactivityVO) throws FLException {

		VactivityPO vactivityPO = vactivityDao.get(vactivityVO.getVaid());

		if (vactivityPO == null) {
			throw new FLException(160011, "活动信息不存在");
		}

		if (vactivityPO.getStatus() != VactivityPO.STATUS_INIT_INT) {
			throw new FLException(160052, "活动不可操作");
		}

		vactivityPO.setStatus(vactivityVO.getStatus());

		vactivityDao.update(vactivityPO);

		vpaymentDao.updateVpaymentForStatus(vactivityPO.getVaid(), VpaymentPO.EXPIRE_INVALID_INT);
		vticketDao.updateVticketForStatus(vactivityPO.getVaid(), VticketPO.EXPIRE_INVALID_INT);
		vprizeDao.updateVprizeForStatus(vactivityPO.getVaid(), VprizePO.STATUS_INVALID_INT);
	}

}
