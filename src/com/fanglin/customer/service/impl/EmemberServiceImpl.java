package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.AESHelper;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.EmemberDao;
import com.fanglin.customer.po.EmemberPO;
import com.fanglin.customer.service.EmemberService;
import com.fanglin.customer.vo.EmemberVO;
import com.fanglin.dingding.service.MessageService;
import com.fanglin.information.dao.VticketDao;
import com.fanglin.information.po.VticketPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;

@Service("ememberService")
@Transactional(readOnly = true)
public class EmemberServiceImpl implements EmemberService {

	@Autowired
	private EmemberDao ememberDao;

	@Autowired
	private VticketDao vticketDao;

	@Autowired
	private MessageService messageService;

	@Override
	public void pageEmember(Paging paging, List<Filter> filters) {

		List<EmemberPO> ememberPOs = ememberDao.pageEmember(paging, filters);
		List<EmemberVO> ememberVOs = new ArrayList<EmemberVO>();

		EmemberVO ememberVO;

		for (EmemberPO ememberPO : ememberPOs) {

			ememberVO = new EmemberVO();

			BeanUtil.copyPropertie(ememberPO, ememberVO);

			ememberVOs.add(ememberVO);
		}

		paging.setData(ememberVOs);
	}

	@Override
	public EmemberVO queryEmember(EmemberVO ememberVO) {

		EmemberPO ememberPO = ememberDao.queryEmenber(ememberVO.getUnionId());

		ememberVO = new EmemberVO();

		if (ememberPO == null) {
			return ememberVO;
		}

		BeanUtil.copyPropertie(ememberPO, ememberVO);

		return ememberVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addEmember(EmemberVO ememberVO, String securityCode, String verifyCode) throws FLException {

		String no = ememberVO.getNo();
		String unionId = ememberVO.getUnionId();

		try {
			if (!verifyCode.equals(AESHelper.decrypt(securityCode, SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv")))) {
				throw new FLException(330012, "验证失败,重新验证");
			}
		} catch (Exception e) {
			throw new FLException(330012, "验证失败,重新验证");
		}

		EmemberPO ememberPO = ememberDao.queryEmenber(unionId);

		if (ememberPO != null) {
			throw new FLException(330013, "电子会员已存在");
		}

		ememberPO = ememberDao.queryEmemberByNo(no);

		if (ememberPO != null) {
			throw new FLException(330013, "电子会员已存在");
		}

		VticketPO vticketPO = vticketDao.queryVticketByTno(no);

		if (vticketPO == null) {
			throw new FLException(160026, "活动票不存在");
		}

		ememberPO = new EmemberPO();

		BeanUtil.copyPropertie(ememberVO, ememberPO);

		ememberPO.setActivity(vticketPO.getVaid());
		ememberPO.setStatus(EmemberPO.STATUS_INIT_INT);

		ememberDao.save(ememberPO);

		vticketPO.setName(ememberVO.getName());
		vticketPO.setPhone(ememberVO.getPhone());
		vticketPO.setAddress(ememberVO.getAddress());
		vticketPO.setIsregist(VticketPO.ISREGIST_YES_INT);

		vticketDao.update(vticketPO);

		messageService.sendMessage(unionId, "活动票", no, String.format("活动票: %s, 注册成功", no));

		return 0;
	}
}
