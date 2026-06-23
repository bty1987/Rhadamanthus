package com.fanglin.system.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "userprefer", catalog = "communion")
public class UserPreferPO implements Serializable {

    private static final long serialVersionUID = -3737146412772771764L;

    public static final String COLUMN_USERID_STR = "userId";

    public static final String COLUMN_MODULE_STR = "module";

    public static final String COLUMN_PAGE_STR = "page";

    public static final String COLUMN_PKEY_STR = "pkey";

    public static final String COLUMN_COMPANY_STR = "company";

    private long upid;

    private String userId;

    private String module;

    private String page;

    private String pkey;

    private String pvalue;

    private int company;

    private Timestamp createTime;

    private Timestamp updateTime;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "upid")
    public long getUpid() {
        return upid;
    }

    public void setUpid(long upid) {
        this.upid = upid;
    }

    @Column(name = "userId")
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    @Column(name = "module")
    public String getModule() {
        return module;
    }

    public void setModule(String module) {
        this.module = module;
    }

    @Column(name = "page")
    public String getPage() {
        return page;
    }

    public void setPage(String page) {
        this.page = page;
    }

    @Column(name = "pkey")
    public String getPkey() {
        return pkey;
    }

    public void setPkey(String pkey) {
        this.pkey = pkey;
    }

    @Column(name = "pvalue")
    public String getPvalue() {
        return pvalue;
    }

    public void setPvalue(String pvalue) {
        this.pvalue = pvalue;
    }

    @Column(name = "company")
    public int getCompany() {
        return company;
    }

    public void setCompany(int company) {
        this.company = company;
    }

    @Column(name = "createTime")
    public Timestamp getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Timestamp createTime) {
        this.createTime = createTime;
    }

    @Column(name = "updateTime")
    public Timestamp getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Timestamp updateTime) {
        this.updateTime = updateTime;
    }

}
