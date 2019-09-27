package com.fanglin.salary.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.salary.dao.DesignerSalaryDao;
import com.fanglin.salary.po.DesignerSalaryPO;
import com.fanglin.salary.service.DesignerSalaryService;
import com.fanglin.salary.vo.DesignerSalaryVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("designerSalaryService")
@Transactional(readOnly = true)
public class DesignerSalaryServiceImpl implements DesignerSalaryService {

	@Autowired
	private DesignerSalaryDao designerSalaryDao;

	@Autowired
	private UserDao userdao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void pagedesignerSalary(Paging paging, List<Filter> filter) {

		List<DesignerSalaryPO> designerSalaryPOs = designerSalaryDao.pageDesignerSalary(paging, filter);
		List<DesignerSalaryVO> designerSalaryVOs = new ArrayList<DesignerSalaryVO>();

		for (DesignerSalaryPO designerSalaryPO : designerSalaryPOs) {

			DesignerSalaryVO designerSalaryVO = new DesignerSalaryVO(new UserVO(), new UserVO(), new UserVO());
			BeanUtil.copyProperties(designerSalaryPO, designerSalaryVO, Arrays.asList("duser", "cuser", "auser"));
			BeanUtil.copyProperties(designerSalaryPO.getCuser(), designerSalaryVO.getCuser(), Arrays.asList("dept", "role"));
			BeanUtil.copyProperties(designerSalaryPO.getDuser(), designerSalaryVO.getDuser(), Arrays.asList("dept", "role"));
			if (designerSalaryPO.getAuser() != null) {

				BeanUtil.copyProperties(designerSalaryPO.getAuser(), designerSalaryVO.getAuser(), Arrays.asList("dept", "role"));
			}

			designerSalaryVOs.add(designerSalaryVO);
		}
		paging.setData(designerSalaryVOs);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void adddesignerSalary(DesignerSalaryVO designerSalaryVO, String userId) throws FLException {

		UserPO du = userdao.get(designerSalaryVO.getDuser().getUid());
		UserPO cu = userdao.queryUserByUserId(userId);

		DesignerSalaryPO designerSalaryPO = new DesignerSalaryPO(du, cu);

		designerSalaryPO.setSalary(designerSalaryVO.getSalary());
		designerSalaryPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		designerSalaryPO.setBalanceTime(new Timestamp(System.currentTimeMillis()));

		designerSalaryDao.save(designerSalaryPO);

		designerSalaryVO.getDuser().setUserName(designerSalaryPO.getDuser().getUserName());
		designerSalaryVO.setCreateTime(designerSalaryPO.getCreateTime());
		designerSalaryVO.setStatus(designerSalaryPO.getStatus());
		designerSalaryVO.setDsid(designerSalaryPO.getDsid());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updatedesignerSalary(DesignerSalaryVO designerSalaryVO) throws FLException {

		DesignerSalaryPO designerSalaryPO = designerSalaryDao.get(designerSalaryVO.getDsid());

		if (designerSalaryPO == null) {
			throw new FLException(280001, "薪资信息不存在");
		}

		if (designerSalaryPO.getStatus() != DesignerSalaryPO.COLUMN_STATUS_STR) {
			throw new FLException(280002, "工费状态不可操作");
		}

		BeanUtil.copyProperties(designerSalaryVO, designerSalaryPO, Arrays.asList("duser", "cuser", "auser"));

		designerSalaryDao.update(designerSalaryPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deletedesignerSalary(DesignerSalaryVO designerSalar) throws FLException {

		DesignerSalaryPO designerSalaryPO = designerSalaryDao.get(designerSalar.getDsid());

		if (designerSalaryPO == null) {
			throw new FLException(280001, "薪资信息不存在");
		}

		if (designerSalaryPO.getStatus() != DesignerSalaryPO.COLUMN_STATUS_STR) {
			throw new FLException(280002, "工费状态不可操作");
		}

		designerSalaryDao.delete(designerSalaryPO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int adoptdesignerSalary(List<DesignerSalaryVO> designerSalarys, String userId) throws FLException {

		UserPO approval = userdao.queryUserByUserId(userId);

		for (DesignerSalaryVO designerSalaryVO : designerSalarys) {

			DesignerSalaryPO designerSalaryPO = designerSalaryDao.get(designerSalaryVO.getDsid());

			if (designerSalaryPO == null) {
				throw new FLException(280001, "薪资信息不存在");
			}

			if (designerSalaryPO.getStatus() != DesignerSalaryPO.COLUMN_STATUS_STR) {
				throw new FLException(280002, "工费状态不可操作");
			}

			designerSalaryPO.setApproveTime(new Timestamp(System.currentTimeMillis()));
			designerSalaryPO.setStatus(DesignerSalaryPO.COLUMN_STATUSONE_STR);
			designerSalaryPO.setAuser(approval);

			designerSalaryDao.update(designerSalaryPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int rejectdesignerSalary(List<DesignerSalaryVO> designerSalarys, String userId) throws FLException {

		UserPO approval = userdao.queryUserByUserId(userId);

		for (DesignerSalaryVO designerSalaryVO : designerSalarys) {

			DesignerSalaryPO designerSalaryPO = designerSalaryDao.get(designerSalaryVO.getDsid());

			if (designerSalaryPO == null) {
				throw new FLException(280001, "薪资信息不存在");
			}

			if (designerSalaryPO.getStatus() != DesignerSalaryPO.COLUMN_STATUS_STR) {
				throw new FLException(280002, "工费状态不可操作");
			}

			designerSalaryPO.setApproveTime(new Timestamp(System.currentTimeMillis()));
			designerSalaryPO.setStatus(DesignerSalaryPO.COLUMN_STATUSTWO_STR);
			designerSalaryPO.setAuser(approval);

			designerSalaryDao.update(designerSalaryPO);

		}

		return 0;
	}

}
