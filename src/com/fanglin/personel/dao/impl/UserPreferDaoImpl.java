package com.fanglin.personel.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.personel.dao.UserPreferDao;
import com.fanglin.personel.po.UserPreferPO;

@Repository("userPreferDao")
public class UserPreferDaoImpl extends DaoImpl<UserPreferPO> implements UserPreferDao {

    public UserPreferDaoImpl() {
        super(UserPreferPO.class);
    }

    @Override
    public UserPreferPO queryUserPrefer(String userId, String module, String page, String pkey, int company) {
        return (UserPreferPO) createCriteria(UserPreferPO.class).add(Restrictions.eq(UserPreferPO.COLUMN_USERID_STR, userId)).add(Restrictions.eq(UserPreferPO.COLUMN_MODULE_STR, module)).add(Restrictions.eq(UserPreferPO.COLUMN_PAGE_STR, page)).add(Restrictions.eq(UserPreferPO.COLUMN_PKEY_STR, pkey)).add(Restrictions.eq(UserPreferPO.COLUMN_COMPANY_STR, company)).uniqueResult();
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<UserPreferPO> queryUserPrefers(String userId, String module, int company) {

        Criteria criteria = createCriteria(UserPreferPO.class).add(Restrictions.eq(UserPreferPO.COLUMN_USERID_STR, userId)).add(Restrictions.eq(UserPreferPO.COLUMN_COMPANY_STR, company));

        if (module != null && !"".equals(module)) {
            criteria.add(Restrictions.eq(UserPreferPO.COLUMN_MODULE_STR, module));
        }

        return criteria.list();
    }

}
