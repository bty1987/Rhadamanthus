package com.fanglin.communion.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.AssistanceDao;
import com.fanglin.communion.po.AssistancePO;
import com.fanglin.communion.service.AssistanceService;
import com.fanglin.communion.vo.AssistanceVO;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("assistanceService")
@Transactional(readOnly = true)
public class AssistanceServiceImpl implements AssistanceService {

	@Autowired
	private AssistanceDao assistanceDao;

	@Autowired
	private UserDao userDao;

	@Override
	public void pageAssistance(Paging paging, List<Filter> filters) {

		List<AssistancePO> assistancePOs = assistanceDao.pageAssistance(paging, filters);
		List<AssistanceVO> assistanceVOs = new ArrayList<AssistanceVO>();

		for (AssistancePO assistancePO : assistancePOs) {

			AssistanceVO assistanceVO = new AssistanceVO(new UserBaseVO());

			BeanUtil.copyProperties(assistancePO, assistanceVO, Arrays.asList("creater"));
			BeanUtil.copyProperties(assistancePO.getCreater(), assistanceVO.getCreater(), Arrays.asList("dept", "duty"));

			assistanceVOs.add(assistanceVO);
		}

		paging.setData(assistanceVOs);

	}

	@Override
	public List<AssistanceVO> queryAssistance(AssistanceVO assistanceVO) {

		List<AssistanceVO> assistanceVOs = new ArrayList<AssistanceVO>();
		List<AssistancePO> assistancePOs = assistanceDao.queryAssistance();

		for (AssistancePO assistancePO : assistancePOs) {

			assistanceVO = new AssistanceVO(new UserBaseVO());

			BeanUtil.copyProperties(assistancePO, assistanceVO, Arrays.asList("creater"));
			BeanUtil.copyProperties(assistancePO.getCreater(), assistanceVO.getCreater(), Arrays.asList("dept", "duty"));

			assistanceVOs.add(assistanceVO);
		}

		return assistanceVOs;
	}

	@Override
	public AssistanceVO queryAssistanceByAid(AssistanceVO assistanceVO) {

		AssistancePO assistancePO = assistanceDao.queryAssistance(assistanceVO.getAid(), null);

		BeanUtil.copyProperties(assistancePO, assistanceVO, Arrays.asList("creater"));
		BeanUtil.copyProperties(assistancePO.getCreater(), assistanceVO.getCreater(), Arrays.asList("dept", "duty"));

		return assistanceVO;
	}

	@Override
	public AssistanceVO queryAssistanceByKeyword(AssistanceVO assistanceVO) {

		AssistancePO assistancePO = assistanceDao.queryAssistance(null, assistanceVO.getKeyword());

		BeanUtil.copyProperties(assistancePO, assistanceVO, Arrays.asList("creater"));
		BeanUtil.copyProperties(assistancePO.getCreater(), assistanceVO.getCreater(), Arrays.asList("dept", "duty"));

		return assistanceVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addAssistance(AssistanceVO assistanceVO, String userId) {

		UserPO creater = userDao.queryUserByUserId(userId);

		AssistancePO assistancePO = new AssistancePO();

		BeanUtil.copyProperties(assistanceVO, assistancePO, Arrays.asList("creater"));

		assistancePO.setCreater(creater);
		assistancePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		assistanceDao.save(assistancePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateAssistance(AssistanceVO assistanceVO) {

		AssistancePO assistancePO = assistanceDao.get(assistanceVO.getAid());

		BeanUtil.copyProperties(assistanceVO, assistancePO, Arrays.asList("creater"));

		assistanceDao.update(assistancePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateAssistanceForStatus(AssistanceVO assistanceVO) {
		AssistancePO assistancePO = assistanceDao.get(assistanceVO.getAid());

		assistancePO.setStatus(assistanceVO.getStatus());

		assistanceDao.update(assistancePO);

		return 0;
	}

}
