package com.fanglin.personel.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.UserPreferDao;
import com.fanglin.personel.po.UserPreferPO;
import com.fanglin.personel.service.UserPreferService;
import com.fanglin.personel.vo.UserPreferVO;

@Service("userPreferService")
@Transactional(readOnly = true)
public class UserPreferServiceImpl implements UserPreferService {

    @Autowired
    private UserPreferDao userPreferDao;

    @Override
    public UserPreferVO queryUserPrefer(UserPreferVO userPreferVO, String userId, int company) throws FLException {

        check(userPreferVO, false);

        UserPreferPO userPreferPO = userPreferDao.queryUserPrefer(userId, userPreferVO.getModule(), userPreferVO.getPage(), userPreferVO.getPkey(), company);

        if (userPreferPO == null) return null;

        return convert(userPreferPO);
    }

    @Override
    public List<UserPreferVO> queryUserPrefers(UserPreferVO userPreferVO, String userId, int company) throws FLException {

        String module = userPreferVO == null ? null : userPreferVO.getModule();

        List<UserPreferVO> userPreferVOs = new ArrayList<UserPreferVO>();

        for (UserPreferPO userPreferPO : userPreferDao.queryUserPrefers(userId, module, company)) {
            userPreferVOs.add(convert(userPreferPO));
        }

        return userPreferVOs;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int updateUserPrefer(UserPreferVO userPreferVO, String userId, int company) throws FLException {

        check(userPreferVO, true);

        UserPreferPO userPreferPO = userPreferDao.queryUserPrefer(userId, userPreferVO.getModule(), userPreferVO.getPage(), userPreferVO.getPkey(), company);

        Timestamp now = new Timestamp(System.currentTimeMillis());

        if (userPreferPO == null) {

            userPreferPO = new UserPreferPO();

            userPreferPO.setUserId(userId);
            userPreferPO.setModule(userPreferVO.getModule());
            userPreferPO.setPage(userPreferVO.getPage());
            userPreferPO.setPkey(userPreferVO.getPkey());
            userPreferPO.setCompany(company);
            userPreferPO.setCreateTime(now);
        }

        userPreferPO.setPvalue(userPreferVO.getPvalue());
        userPreferPO.setUpdateTime(now);

        userPreferDao.saveOrUpdate(userPreferPO);

        return 0;
    }

    private void check(UserPreferVO userPreferVO, boolean update) throws FLException {

        if (userPreferVO == null) {
            throw new FLException(110000, "系统处理问题");
        }

        if (empty(userPreferVO.getModule()) || empty(userPreferVO.getPage()) || empty(userPreferVO.getPkey())) {
            throw new FLException(110000, "系统处理问题");
        }

        if (update && "searcher".equals(userPreferVO.getModule()) && "viewMode".equals(userPreferVO.getPkey())) {

            String value = userPreferVO.getPvalue();

            if (!"line".equals(value) && !"card".equals(value) && !"table".equals(value)) {
                throw new FLException(110000, "系统处理问题");
            }
        }
    }

    private boolean empty(String value) {
        return value == null || "".equals(value.trim());
    }

    private UserPreferVO convert(UserPreferPO userPreferPO) {

        UserPreferVO userPreferVO = new UserPreferVO();

        userPreferVO.setUpid(userPreferPO.getUpid());
        userPreferVO.setUserId(userPreferPO.getUserId());
        userPreferVO.setModule(userPreferPO.getModule());
        userPreferVO.setPage(userPreferPO.getPage());
        userPreferVO.setPkey(userPreferPO.getPkey());
        userPreferVO.setPvalue(userPreferPO.getPvalue());
        userPreferVO.setCompany(userPreferPO.getCompany());
        userPreferVO.setCreateTime(userPreferPO.getCreateTime());
        userPreferVO.setUpdateTime(userPreferPO.getUpdateTime());

        return userPreferVO;
    }

}
