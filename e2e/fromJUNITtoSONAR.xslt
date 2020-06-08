<?xml version='1.0'?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:output method="xml" indent="yes" />
    <xsl:template match="/">
        <testExecutions>
                <xsl:attribute name="version">1</xsl:attribute>  
                <xsl:for-each select="./testsuites/testsuite">
                    <file>
                        <xsl:attribute name="path">
                            <xsl:value-of select="'e2e/src/steps/'"/>
                            <xsl:value-of select="@*[name(.)='name']"/>
                            <xsl:value-of select="'.steps.ts'"/>
                        </xsl:attribute>
                        <xsl:for-each select="./testcase">
                            <testCase>
                                <xsl:attribute name="name">
                                    <xsl:value-of select="@*[name(.)='classname']"/>
                                </xsl:attribute>
                                <xsl:attribute name="duration">
                                    <xsl:value-of select="'1'"/> <!-- format-number(@*[name(.)='time']*1000, '#')-->
                                </xsl:attribute>
                                <xsl:for-each select="./skipped">
                                    <skipped>
                                            <xsl:attribute name="message">TestCase skipped</xsl:attribute>
                                    </skipped>
                                </xsl:for-each>
                                <xsl:for-each select="./failure">
                                        <xsl:choose>
                                            <xsl:when test="matches(@*[name(.)='message'],'^Undefined step')">
                                                <skipped>
                                                    <xsl:attribute name="message">Scenario undefined</xsl:attribute>
                                                </skipped>
                                            </xsl:when>
                                            <xsl:otherwise>
                                                <failure>
                                                    <xsl:attribute name="message">Error</xsl:attribute>
                                                    <xsl:value-of select="."/>
                                                </failure>
                                            </xsl:otherwise>
                                        </xsl:choose>
                                </xsl:for-each>
                            </testCase>
                        </xsl:for-each>
                    </file>
            </xsl:for-each>
    	</testExecutions>
    </xsl:template>
</xsl:stylesheet>