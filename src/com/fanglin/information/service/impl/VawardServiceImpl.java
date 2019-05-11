/**
 * @File Name		: VawardServiceImpl.java
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
import com.fanglin.customer.dao.EmemberDao;
import com.fanglin.customer.po.EmemberPO;
import com.fanglin.dingding.service.MessageService;
import com.fanglin.information.dao.VawardDao;
import com.fanglin.information.dao.VprizeDao;
import com.fanglin.information.dao.VticketDao;
import com.fanglin.information.po.VawardPO;
import com.fanglin.information.po.VprizePO;
import com.fanglin.information.po.VticketPO;
import com.fanglin.information.service.VawardService;
import com.fanglin.information.vo.VawardVO;
import com.fanglin.utils.BeanUtil;

@Service("vawardService")
@Transactional(readOnly = true)
public class VawardServiceImpl implements VawardService {

	@Autowired
	private VawardDao vawardDao;
	
	@Autowired
	private VticketDao vticketDao;
	
	@Autowired
	private VprizeDao vprizeDao;
	
	@Autowired
	private EmemberDao ememberDao;
	
	@Autowired
	private MessageService messageService;

	@Override
	public List<VawardVO> queryVawardByNo(VawardVO vawardVO) {

		List<VawardPO> vawardPOs = vawardDao.queryVawardByNo(vawardVO.getNo());
		List<VawardVO> vawardVOs = new ArrayList<VawardVO>();

		for (VawardPO vawardPO : vawardPOs) {
			vawardVO = new VawardVO();

			BeanUtil.copyPropertie(vawardPO, vawardVO);

			vawardVOs.add(vawardVO);
		}

		return vawardVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addVaward(VawardVO vawardVO) throws FLException {
		
		String no = vawardVO.getNo();
		
		VticketPO vticketPO = vticketDao.queryVticketByTno(no);

		if (vticketPO == null) {
			throw new FLException(160026, "活动票不存在");
		}
		
		if(vticketPO.getIscome() != VticketPO.ISCOME_YES_INT){
			throw new FLException(160046, "活动票未到场");
		}
		
		VprizePO vprizePO = vprizeDao.get(vawardVO.getVpid());
		
		if (vprizePO == null) {
			throw new FLException(160048, "奖品不存在");
		}
		
		if(vprizePO.getVaid() != vticketPO.getVaid()){
			throw new FLException(160049, "活动不同不可操作");
		}
		
		VawardPO vawardPO = new VawardPO();
		
		vawardPO.setNo(no);
		vawardPO.setVpid(vprizePO.getVpid());
		vawardPO.setName(vprizePO.getName());
		vawardPO.setPrice(vprizePO.getPrice());
		vawardPO.setNum(vawardVO.getNum());
		vawardPO.setStatus(VawardPO.STATUS_INIT_INT);
		
		vawardDao.save(vawardPO);
		
		EmemberPO ememberPO = ememberDao.queryEmemberByNo(no);

		if (ememberPO != null) {
			messageService.sendMessage(ememberPO.getUnionId(), "活动奖品", no, String.format("活动奖品: %s, 数量: %.2f, 领取成功", vprizePO.getName(), vawardVO.getNum()));
		}
		
		return 0;
	}

}
