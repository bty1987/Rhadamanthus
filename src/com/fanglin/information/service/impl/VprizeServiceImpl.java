/**
 * @File Name		: VprizeServiceImpl.java
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
import com.fanglin.information.dao.VprizeDao;
import com.fanglin.information.dao.VticketDao;
import com.fanglin.information.po.VprizePO;
import com.fanglin.information.po.VticketPO;
import com.fanglin.information.service.VprizeService;
import com.fanglin.information.vo.VprizeVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("vprizeService")
@Transactional(readOnly = true)
public class VprizeServiceImpl implements VprizeService {

	@Autowired
	private VprizeDao vprizeDao;

	@Autowired
	private VticketDao vticketDao;

	@Override
	public void pageVprice(Paging paging, List<Filter> filters) {

		List<VprizePO> vprizePOs = vprizeDao.pageVprize(paging, filters);
		List<VprizeVO> vprizeVOs = new ArrayList<VprizeVO>();

		VprizeVO vprizeVO;

		for (VprizePO vprizePO : vprizePOs) {
			vprizeVO = new VprizeVO();

			BeanUtil.copyPropertie(vprizePO, vprizeVO);

			vprizeVOs.add(vprizeVO);
		}

		paging.setData(vprizeVOs);
	}

	@Override
	public List<VprizeVO> queryVprize(VprizeVO vprizeVO) {

		List<VprizePO> vprizePOs = vprizeDao.queryVprize(vprizeVO.getVaid());
		List<VprizeVO> vprizeVOs = new ArrayList<VprizeVO>();

		for (VprizePO vprizePO : vprizePOs) {
			vprizeVO = new VprizeVO();

			BeanUtil.copyPropertie(vprizePO, vprizeVO);

			vprizeVOs.add(vprizeVO);
		}

		return vprizeVOs;
	}

	@Override
	public List<VprizeVO> queryVprizeByNo(String no) throws FLException {

		VticketPO vticketPO = vticketDao.queryVticketByTno(no);

		if (vticketPO == null) {
			throw new FLException(160026, "活动票不存在");
		}

		List<VprizePO> vprizePOs = vprizeDao.queryVprize(vticketPO.getVaid());
		List<VprizeVO> vprizeVOs = new ArrayList<VprizeVO>();

		VprizeVO vprizeVO;

		for (VprizePO vprizePO : vprizePOs) {
			vprizeVO = new VprizeVO();

			BeanUtil.copyPropertie(vprizePO, vprizeVO);

			vprizeVOs.add(vprizeVO);
		}

		return vprizeVOs;

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addVprize(VprizeVO vprizeVO) {

		VprizePO vprizePO = new VprizePO();

		BeanUtil.copyPropertie(vprizeVO, vprizePO);

		vprizePO.setStatus(VprizePO.STATUS_INIT_INT);

		vprizeDao.save(vprizePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateVprize(VprizeVO vprizeVO) throws FLException {

		VprizePO vprizePO = vprizeDao.get(vprizeVO.getVpid());

		if (vprizePO == null) {
			throw new FLException(160048, "奖品不存在");
		}

		vprizePO.setName(vprizeVO.getName());
		vprizePO.setPrice(vprizeVO.getPrice());

		vprizeDao.update(vprizePO);

		return 0;
	}

	@Override
	public int updateVprizeForStatus(VprizeVO vprizeVO) throws FLException {

		VprizePO vprizePO = vprizeDao.get(vprizeVO.getVpid());

		if (vprizePO == null) {
			throw new FLException(160048, "奖品不存在");
		}

		vprizePO.setStatus(vprizeVO.getStatus());

		vprizeDao.update(vprizePO);

		return 0;
	}

}
